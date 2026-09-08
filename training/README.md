# AI student keypoint training

The review tool exports border-keypoints-v1 targets:

- 12 outer keypoints: P1, P2 and P3 on all four physical card edges
- 12 inner keypoints for cards with a real print or art boundary
- corrected tilt angle and layout mode
- millimeter margins and conservative worst-point centering

Only user-confirmed Gold labels are admitted to the supervised dataset. AI seeds remain
pseudo-labels and never silently become ground truth. Card layout does not determine the
measurement mode: a visible border/print transition uses inner-edge keypoints, while the
reference/template route is reserved for cards without a consistent transition.

Prepare a model-ready dataset with:

    npm run student:prepare -- Pokemon_Centering_Gold_v16_labels.json /path/to/private/student-dataset-v1.json

The generated file can feed the next student-model training run. The UI and export use
the same measurement convention: the mathematical centerline sits on the visual
transition; the colored dashed halo has no effect on the coordinates.

Status: this repository prepares and validates training targets. It does not yet
contain trained student-model weights or a measured recognition/centering benchmark.

## Image coordinates and preservation

Keypoints are normalized in the 630×880 **review canvas**. A trainer must rotate the
input image around `image_transform.pivot_px`, then translate it by
`image_transform.translation_px`, before comparing predicted points with these labels.
Ignoring this transform would train against misplaced targets whenever the user used
tilt or pan. The builder also recovers these values from v15 Gold exports.

Every example carries its image path and asset revision. Confirmed v15 labels keep
their original image; the eight revised crops are used for unconfirmed v16 reviews.
The mislabeled pre-v16 Reshiram image is excluded from supervised training.
Private Gold exports and source scans must not be committed to this public repository.

## Reference-assisted student route

1. Identify the exact design by set, collector number, language and variant. Catalogs
   such as [PokéCottage](https://pokecottage.com/) can supply identity and visual references;
   they are not themselves verified centering/keypoint annotations.
2. Annotate a visible print transition on a checked reference for each exact design.
   Match internal artwork features to the scan and transfer only print landmarks.
   Keep the physical scan contour independently detected and checked. Full-art cards
   without a repeatable boundary require design landmarks, not a fictitious inner box.
3. Use user-confirmed scans to validate transferred landmarks. Never promote a match
   confidence score or a catalog crop automatically to Gold truth.
4. Train on checked scan/label pairs, adding tilt, lighting, blur, reflection and crop
   variations with the same transformation applied to the labels. Keep all duplicates
   and augmentations of one design in the same train/validation/test group.
5. Report exact-design recognition and scan-space edge error separately. Require a
   held-out result before enabling automated measurements in the review UI.

[OpenCV's feature matching and homography tutorial](https://docs.opencv.org/4.x/d1/de0/tutorial_py_feature_homography.html)
documents the reference-to-scan matching mechanism. Reference artwork can help locate
the print; it cannot establish how centered an individual physical card was cut.
