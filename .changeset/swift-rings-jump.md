---
'frontend-gelinkt-notuleren': minor
---

Partly refactor `AgendapointEditController` into seperate ember service:
- Move `schema`, `plugins`, `nodeviews` and config to the `AgendapointEditorService`
- Allows for easily sharing these settings between the headful and headless editor instances
- Service includes a method to easily compute a state based on a passed html string
