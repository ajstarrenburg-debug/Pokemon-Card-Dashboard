# Pokemon Card Dashboard

Development dashboard for Pokemon card scan QA, centering and AI-assisted inner-border review.

## Current module
- AI Learning -> Inner Review
- 16-card Gold review, app v0.16
- draggable outer and inner edges/corners
- AI-first tilt correction with a selectable fixed rotation point
- cyan level guides coupled to the physical outer border
- dashed magenta inner-border guide for better edge visibility
- 1 px measurement core placed on the true visual transition
- three visible measurement points per side with millimeter values
- worst-point L/R and T/B centering with measurement spread
- quadrilateral corners for rotated/diamond-cut print frames
- drag loupe for precise border placement
- loupe renders the same pan and tilt as the main card and follows the selected edge angle
- two-row control groups prevent labels from crossing button boundaries
- per-card horizontal and vertical image positioning
- desktop controls remain beside the card instead of below it
- direct layer selection with larger draggable hit areas
- one baseline JPEG per review card (no sprite/base64 loader)
- browser autosave
- JSON export and local-only JSON restore with a per-card preview and conflict protection
- border-keypoints-v1 AI-student targets (12 outer + 12 inner keypoints)
- automated Chromium, Firefox and WebKit compatibility check
- clickable 16-card review queue with synchronized active state
- unfinished dashboard modules are visibly disabled and labeled `Binnenkort`
- Misty's Lapras uses a complete padded crop and a real illustration-border inner edge
- card layout and measurement mode are independent; every visible border/print transition enables the inner-edge tool
- v0.14/v0.15 progress migrates without altering confirmed geometry, tilt, notes or keypoints
- eight unconfirmed cards use wider aspect-preserving source crops; N's Reshiram uses the correct source position
- confirmed image revisions remain available so later confirmations cannot attach to changed pixels
- source-to-asset audit and migration checks protect existing Gold work
- student datasets retain image revision, rotation pivot and pan alongside review-canvas targets
- Black Belt's Training keeps manual inner-edge controls with an explicit unreliable-AI warning
- subtle dashed viewing guides with unchanged 1 px measurement cores and large invisible drag targets

The repository contains the webapp/development assets only. Original high-resolution collection scans are intentionally not stored here.

## Restore a Gold export

In Inner Review, choose **Import Gold labels JSON**, select a local export, inspect the
per-card preview, then choose **Herstel ontbrekende beoordelingen**. Expand a card to
see its points, notes, rotation, pan, confirmation and original image revision.
Cancel leaves local storage untouched. Existing saved cards and unsaved edits on the
current card are always skipped in full, including unconfirmed cards. There is no
replace-all or force-overwrite option. An all-conflict file makes no changes.

Supported exports: `centering-gold-v08` through `centering-gold-v16`. Older box geometry
is converted to corners; the old provisional `reference_or_edge` mode becomes
`reference_required`. Unknown/future formats, duplicate or unknown card IDs,
invalid geometry/types/revisions and files larger than 5 MB are rejected as a whole.
Lapras labels from before v14 are also rejected: their original image is not shipped,
so restoring those coordinates onto the current image would be unsafe.
Pre-v08 exports are intentionally unsupported because their image/coordinate history
cannot be safely inferred. Export files contain labels, not the source images.

Restored labels retain their original image revision and coordinates, including
unconfirmed work: the local `restored_from_export` flag exempts them from automatic
seed/mode refresh. Explicitly choosing Reset AI for a restored card adopts the current
image/seed and requires confirmation again. Existing non-imported migration behavior is unchanged. Derived
student targets are rebuilt on the next save/export from the restored geometry and
image transform; imported paths and derived targets are never used to load images.

The preview does not write storage. Confirmation uses one atomic write to
`pokemon_centering_gold_v16`; storage failures leave the previous value intact.
Changes to the current draft or storage during preview invalidate the preview.
If another tab changed storage before selection, reload before importing.

Import processing never uploads the selected file or writes to the repository or
training pipeline. Keep personal Gold exports and original scans outside this public
repository; `private/` and `local_exports/` are ignored as an additional safeguard.
Tests generate fictional points/notes and browser tests substitute a blank card image.
Only explicitly approved example files may be published. This feature is independent
of New batch and does not modify training code or data.

Validation:

```sh
npm ci
npm run test:state
npm run test:restore
npm run build
# For browser checks, serve the repository on port 4173 and install Playwright:
npm install --no-save --package-lock=false playwright@1.55.0
npx playwright install chromium firefox webkit
npm run test:restore:browser
```
