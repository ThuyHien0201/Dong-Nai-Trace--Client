---
name: Imported workspace runtime
description: Environment-specific setup note for imported artifact workspaces.
---

Imported artifact metadata may exist in the repository without being registered in the runtime artifact catalog. In that case, the managed artifact workflow name is unavailable and the app must be run with a minimal named workflow that supplies the artifact's existing PORT and BASE_PATH values.

**Why:** The runtime can have no registered artifacts even when `.replit-artifact/artifact.toml` is present, so assuming managed workflow registration can leave a working app unable to start.

**How to apply:** Check the runtime artifact/workflow lists before restarting an imported app; if the artifact is absent, use its existing metadata values rather than changing the app's Vite configuration.