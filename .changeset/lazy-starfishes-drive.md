---
"frontend-gelinkt-notuleren": patch
---

correctly deal with the 2 types of versionedNotulen

- correctly show signatures even after document is published
- correctly show the full document when signing even if notulen is already published with some parts marked private (you always sign the whole document)
  -> the page was showing the wrong document in the signing modal in 
  niche cases before, leading users to sign a different document than what they 
  were looking at
