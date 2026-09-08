# v0.16 release checkpoint

Prepared on 2026-09-08. This code branch is not the live release.

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

## Remaining gate

Automatic approval review blocked uploading the eight revised crops to the public
GitHub repository because explicit permission for these images was not established.
The code-only checkpoint therefore retains the currently published root images.
Do not deploy or treat this branch as a completed crop release.

After permission is obtained, regenerate the eight open JPEGs with
`python tools/build_review_assets.py`. Preserve the original versions from v15 in
`cards/v15/` for existing confirmations. The eight confirmed root JPEGs must remain
unchanged; `python tools/audit_review_assets.py` checks this.

Run the complete Chromium / Firefox / WebKit workflow on
`fix/review-v16-safe-crops` with the final images, inspect the screenshots, and only
then advance `main`. Browser test code is prepared, but this new release has not yet
passed that three-engine gate. Original scans and private Gold exports remain private.

The student export is a dataset preparation step; no student model has been trained
or benchmarked by this release. See `training/README.md` for the reference-assisted route.
