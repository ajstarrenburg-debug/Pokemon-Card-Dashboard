# v0.16 release checks

Prepared on 2026-09-08. See the branch's browser workflow and Pages deployment for release status.

## Completed checks

- All 16 JPEGs decode at 630×880 in the local Chrome preview; all 16 inner-border buttons are enabled.
- Eight unconfirmed images were checked against the available source scans with wider, aspect-preserving crops.
- A-B01-P5 now maps to source slot 2, N's Reshiram. Its previous image was Budew.
- The eight confirmed image hashes are unchanged.
- Migration was checked against the user's private v15 export: eight confirmations retain outer/inner geometry, tilt, pivot, pan, edits and notes.
- A confirmation made after that export retains its older image revision.
- Build, state migration checks and student dataset self-check pass locally.
- Training inputs retain the canvas image transform; eight confirmed examples can be prepared from the private v15 export.
- The card stays visible in the desktop preview while the right-hand controls scroll.

## Publication and browser gate

Explicit permission to publish all eight revised crops in this public GitHub
repository was received on 2026-09-08. Original source scans and private Gold
exports remain outside the repository.

To reproduce the eight open JPEGs, use
`python tools/build_review_assets.py`. Preserve the original versions from v15 in
`cards/v15/` for existing confirmations. The eight confirmed root JPEGs must remain
unchanged; `python tools/audit_review_assets.py` checks this.

Run the complete Chromium / Firefox / WebKit workflow on
`fix/review-v16-safe-crops` with the final images, inspect the screenshots, and only
then advance `main`. The workflow result is the authoritative record for that
three-engine gate.

The student export is a dataset preparation step; no student model has been trained
or benchmarked by this release. See `training/README.md` for the reference-assisted route.
