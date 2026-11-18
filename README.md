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
- JSON export for confirmed labels
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


## Perspective-correct measurements

Measurements use an outer-card-plane homography derived only from the four physical
card corners. The same transform is applied to the inner print frame. The original
image and annotation corners remain unchanged; the visible white measurement
segments are mapped back onto the original image. This assumes a flat rectangular
card; it does not correct lens distortion or curved cards.

P1/P2/P3 for millimeter measurements are sampled at 25%, 50%, and 75% along each
rectified inner edge. The worst of these three pairs is reported. Their half-range
is variation between samples, not a statistical uncertainty interval.

Invalid, crossed, collapsed or out-of-card geometry produces no percentage.
Confirmation, navigation that saves, and export stop until the geometry is repaired
or an appropriate non-inner measurement mode is chosen. Invalid geometry in an
older saved record also blocks export; no records are silently omitted.

Gold corner coordinates, image revisions and existing review-canvas keypoint
conventions are preserved. Derived millimeters and ratios are recomputed on save
or export and can change for previously skewed labels. New targets carry
`measurement_method: outer-card-plane-v1`,
`measurement_sample_space: rectified_inner_edges`, and
`keypoint_sample_space: review_canvas` to distinguish those conventions. Existing
exports and the training builder remain compatible; old exports are not rewritten.

Run `npm run test:geometry` for the 20 fixed coordinate cases plus general projective
transforms, preservation of tilted print, invalid data and the no-storage-write guard.
The fixtures contain only fictional coordinates, not scans or personal Gold data.
