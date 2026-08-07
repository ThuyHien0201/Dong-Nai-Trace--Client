---
name: Mobile horizontal controls
description: Responsive rules for tab and filter rows in the Expo mobile app.
---

Horizontal tab and filter controls must explicitly align their content on the cross axis and constrain the scroll container height. Short fixed sets should use equal-width items instead of horizontal scrolling when all options fit.

**Why:** Unconstrained horizontal content containers can stretch vertically on narrow screens, turning compact tabs into tall broken columns like the sync-status controls.

**How to apply:** When adding or editing a horizontal `ScrollView` or `FlatList` in the mobile app, add bounded height/flex growth and `alignItems: "center"` to its content container. For small fixed groups, use a wrapping row with `flex: 1`, `minWidth: 0`, and single-line centered labels.