(function () {
  'use strict';

  var PLAY_BASE =
    'https://play.google.com/store/apps/details?id=com.planecollector.planecollector';
  var APP_STORE = 'https://apps.apple.com/app/id6800778227';

  function normalizeCode(raw) {
    if (!raw) return null;
    var cleaned = String(raw).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length < 6 || cleaned.length > 12) return null;
    return cleaned;
  }

  function readRef() {
    var params = new URLSearchParams(window.location.search);
    return normalizeCode(
      params.get('ref') || params.get('code') || params.get('invite')
    );
  }

  function detectPlatform() {
    var ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }
    return 'other';
  }

  function playUrl(code) {
    if (!code) return PLAY_BASE;
    return PLAY_BASE + '&referrer=' + encodeURIComponent('ref=' + code);
  }

  function setStatus(text, isWarn) {
    var el = document.getElementById('status');
    if (!text) {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle('is-warn', !!isWarn);
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  function storeTarget(platform, code) {
    if (platform === 'android') return playUrl(code);
    if (platform === 'ios') return APP_STORE;
    return null;
  }

  function init() {
    var code = readRef();
    var platform = detectPlatform();
    var codeCard = document.getElementById('code-card');
    var codeValue = document.getElementById('code-value');
    var primaryBtn = document.getElementById('primary-btn');
    var copyBtn = document.getElementById('copy-btn');
    var androidLink = document.getElementById('android-link');
    var iosLink = document.getElementById('ios-link');

    androidLink.href = playUrl(code);
    iosLink.href = APP_STORE;

    if (code) {
      codeCard.classList.remove('hidden');
      codeValue.textContent = code;
    } else {
      setStatus('Missing invite code in the link. Ask your friend to share again.', true);
    }

    if (platform === 'android') {
      primaryBtn.textContent = 'Install on Google Play';
    } else if (platform === 'ios') {
      primaryBtn.textContent = 'Install on the App Store';
    } else {
      primaryBtn.textContent = 'Choose your store below';
    }

    copyBtn.disabled = !code;
    copyBtn.addEventListener('click', function () {
      if (!code) return;
      copyText(code).then(function (ok) {
        if (ok) {
          setStatus('Invitation copied. Open PlaneCollector and tap Paste invitation.');
        } else {
          setStatus('Could not copy. Long-press the code above and copy it manually.', true);
        }
      });
    });

    primaryBtn.addEventListener('click', function () {
      var target = storeTarget(platform, code);
      if (!target) {
        setStatus('Pick Google Play or App Store below.', true);
        return;
      }

      // iOS: copy after user gesture, verify, then navigate.
      if (platform === 'ios' && code) {
        primaryBtn.disabled = true;
        copyText(code).then(function (ok) {
          if (ok) {
            setStatus('Invitation copied. Opening the App Store…');
            window.location.assign(APP_STORE);
          } else {
            primaryBtn.disabled = false;
            setStatus(
              'Safari blocked copy. Tap COPY INVITATION, then open the App Store.',
              true
            );
          }
        });
        return;
      }

      window.location.assign(target);
    });

    // Expose for simple automated checks (no analytics).
    window.__PC_INVITE__ = {
      normalizeCode: normalizeCode,
      readRef: readRef,
      detectPlatform: detectPlatform,
      playUrl: playUrl,
      APP_STORE: APP_STORE,
      PLAY_BASE: PLAY_BASE,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
