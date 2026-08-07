---
name: Expo Feather icon compatibility
description: Runtime and typecheck behavior for icon names used by the mobile Expo app.
---

Expo's Feather icon set can reject or warn on names that exist in other icon libraries or in the web UI. Keep icon names within the Expo Feather glyph list; when a web icon is unavailable, use a visually equivalent supported glyph such as `crosshair` for QR scanning.

**Why:** Unsupported glyph names can produce TypeScript errors and browser-console warnings even when the surrounding screen renders.

**How to apply:** When mirroring a web screen in `artifacts/mobile`, validate every `Feather` name against the Expo icon set before finishing typecheck or preview verification.