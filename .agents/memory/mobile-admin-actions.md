---
name: Mobile admin actions
description: Behavioral rule for action controls in mobile admin screens.
---

Admin action controls in mobile screens should complete the visible state transition after confirmation: edit updates the selected record, lock toggles its status, delete removes it, and reset-password reports the result.

**Why:** A confirmation alert alone makes a control look functional while leaving the list and detail views unchanged, which is especially misleading in touch interfaces.