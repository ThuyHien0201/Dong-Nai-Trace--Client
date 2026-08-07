---
name: Mobile banner verification
description: Verification boundary for the mobile CMS banner screen.
---

The mobile CMS banner screen can be validated independently with the Expo iOS and Android production bundle build when workspace-wide TypeScript checks are blocked by unrelated legacy errors.

**Why:** The imported workspace currently has pre-existing type errors outside CMS, while Metro and both platform bundles still provide a direct signal that the Banner screen compiles and loads.