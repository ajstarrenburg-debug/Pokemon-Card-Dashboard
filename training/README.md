# AI student keypoint training

The review tool exports border-keypoints-v1 targets:

- 12 outer keypoints: P1, P2 and P3 on all four physical card edges
- 12 inner keypoints for cards with a real print or art boundary
- corrected tilt angle and layout mode
- millimeter margins and conservative worst-point centering

Only user-confirmed Gold labels are admitted to the supervised dataset. AI seeds remain
pseudo-labels and never silently become ground truth. Full-art and borderless cards use
the reference/template route instead of an invented inner border.

Prepare a model-ready dataset with:

    npm run student:prepare -- Pokemon_Centering_Gold_v12_labels.json training/student-dataset-v1.json

The generated file can feed the next student-model training run. The UI and export use
the same measurement convention: the mathematical centerline sits on the visual
transition; the colored dashed halo has no effect on the coordinates.
