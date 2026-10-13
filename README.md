# PlaneCollector invite landing (GitHub Pages)

Static mobile invite page for Invite & Earn.

## Live URL

```
https://deikoo.github.io/planecollector-invite/?ref=ABCD2345
```

**GitHub repo:** https://github.com/Deikoo/planecollector-invite  

Privacy site (`planecollector-privacy`) is separate and unchanged.

## Local preview

```bash
# from this folder
npx --yes serve -p 4173
# open http://127.0.0.1:4173/?ref=ABCD2345
```

## Client release (later — not enabled yet)

Documented in `docs/INVITE_LANDING_RELEASE_NOTES.md`:

```bash
flutter build appbundle --release \
  --dart-define=INVITE_LANDING_BASE_URL=https://deikoo.github.io/planecollector-invite
```

## Behaviour

| Platform | Primary button |
|----------|----------------|
| Android | Opens Play with `referrer=ref=CODE` |
| iOS | Copies code (user gesture), verifies, then App Store |
| Other | Asks user to pick a store link |

Secondary **COPY INVITATION** if clipboard is blocked.

No analytics, no paid attribution SDKs.

## Publish / update Pages

This folder is the source of truth in the PlaneCollector repo. The public site is the separate `planecollector-invite` repository (root = Pages site).
