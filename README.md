# Pokemon Card Dashboard

Development dashboard for Pokemon card scan QA, centering and AI-assisted inner-border review.

## Current module
- AI Learning -> Inner Review
- 16-card Gold Set v0.4
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
- v0.14 progress migrates without altering confirmed geometry, tilt, notes or keypoints
- Black Belt's Training keeps manual inner-edge controls with an explicit unreliable-AI warning
- subtle dashed viewing guides with unchanged 1 px measurement cores and large invisible drag targets

The repository contains the webapp/development assets only. Original high-resolution collection scans are intentionally not stored here.
