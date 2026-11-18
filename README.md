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


## Review reliability v0.16.1

The existing v16 storage key, images and confirmed image revisions are preserved.
Changes to geometry, measurement mode, tilt, pan or reset invalidate confirmation.
The previous confirmed annotation is retained in `confirmation_history`; Undo can
restore the original reviewed state. Notes can change without invalidating geometry.
Each new confirmation records a fingerprint of its actual annotation state.

Concepts autosave after edits and flush on page exit. Invalid concepts may be saved
as drafts and revisited, but cannot be confirmed or exported as valid measurement
labels. Storage errors leave the current concept visible and do not report a false
successful confirmation. Unexpected stored JSON is preserved and not overwritten.
A raw recovery download is provided; it is explicitly not a training-label export.
The label export includes drafts and marks them as such; the dataset builder admits
only confirmed, eligible examples and excludes `not_measurable` records.

The reviewed Gengar start proposal is tied to `cards/A-B03-P5.jpg` without changing
that JPEG. It follows visually inspected straight border intersections rather than
the holder. It is a proposal, not calibrated ground truth. Existing confirmed or
manually changed points are never replaced by this new proposal. An older untouched
proposal is refreshed only when geometry and edit/registration metadata agree that
it was not manually changed.

The precision view projects the actual annotation endpoints relative to its current
inspection center. Hovering beside a hit area no longer draws a fictitious centerline
through the cursor. Both border families remain visible in the detail view; the
active layer is locked against accidental dragging of the inactive layer. Side
selection, fractional-pixel nudging and keyboard handle movement are available.
Outer corrections no longer push inner points silently into a different location.

## Perspective-correct measurement protocol

`outer-card-plane-v2` derives one homography only from the four physical card corners.
It applies the same transformation to the print boundary; a tilted print is not
independently made square. This assumes a flat rectangular card and a nominal size
of 63×88 mm. It does not calibrate lens distortion, curved cards, or physical size.

Opposite distances use common cross sections in the rectified card plane. Left/right
share the same y coordinate in the overlap of their straight inner edges;
top/bottom share the same x coordinate. Three sections are taken at 25%, 50%, 75%
of each common interval. The displayed result is explicitly the worst **of three**,
not the maximum over every part of the border or an official grading prediction.
The displayed range is the actual minimum/maximum of the first-side percentages,
not a statistical uncertainty interval around the worst sample.

Original review-canvas training keypoints retain their existing convention. Visible
measurement endpoints are exported separately under `measurement_points`.
Targets carry `measurement_method: outer-card-plane-v2`,
`measurement_sample_space: rectified_common_cross_sections`,
`measurement_domains`, and `keypoint_sample_space: review_canvas`.
Derived values are recomputed on label export and can change from earlier methods.
The dataset declares its methods and validates coordinates, unique IDs, distances,
ratios and worst-point consistency. Consumers must select a compatible target method
rather than silently mix legacy and rectified derived values.

Only loaded images with valid visible geometry can be confirmed. Convexity, finite
coordinates and containment are numerical guards, not proof of a correct visual
boundary. Use straight edge intersections at rounded corners, not sleeve or holder
edges. A missing print boundary requires a reference; the reference-assisted matcher
itself is not built into this module. Unmeasurable examples are explicitly excluded
from ordinary positive geometry training.

## Verification

- `npm run test:geometry`: 20 independent coordinate cases plus projective/invalid cases.
- `npm run test:state`: confirmed labels and image-revision migration preservation.
- `npm run test:reliability`: 18 real-source flow checks, with isolated synthetic storage.
- `npm run test:student`: dataset conversion self-test.
- GitHub Actions runs existing compatibility, geometry, reliability and recovery
  checks in Chromium, Firefox and WebKit, including 1440px and 390px layouts.

No private scans or actual user Gold exports are used in the automated flow tests.
Image hashes protect retained assets; they do not establish visual annotation accuracy.
A physical calibration benchmark and a real iPhone touch test remain separate work.
