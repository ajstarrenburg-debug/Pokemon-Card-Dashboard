"""Build the 16 browser-safe Inner Review card images from the original scans.

The public review app deliberately uses ordinary baseline JPEG files.  Do not
replace them with a base64 payload or a sprite: those two shortcuts caused the
cross-browser failures this script was introduced to remove.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SCANS = ROOT.parent / "batch-scans" / "Pokemon"
OUTPUT = ROOT / "cards"
CANVAS = (630, 880)
SAFE_MARGIN = 45

# These eight files already have user-confirmed Gold labels in the v0.15
# review export.  Keep their exact published pixels unless a deliberate full
# rebuild is requested; changing a confirmed image would invalidate its label.
CONFIRMED_LOCKED = {
    "A-B03-P5",
    "A-B12-P5",
    "A-B13-P1",
    "A-B14-P6",
    "A-B03-P4",
    "A-B07-P4",
    "A-B10-P6",
    "A-B16-P5",
}

OPEN_SAFE_RECROP = {
    "A-B01-P5",
    "A-B05-P4",
    "A-B15-P1",
    "A-B15-P2",
    "A-B04-P6",
    "A-B09-P4",
    "A-B10-P5",
    "A-B13-P6",
}

# Batch 1 is stored in reverse physical order relative to its registered card
# IDs.  A-B01-P5 is N's Reshiram in source slot 2; slot 5 is Budew.  The old
# dashboard selected slot 5 and therefore showed the wrong, clipped card.
SOURCE_POSITION_OVERRIDES = {"A-B01-P5": 2}

# N's Reshiram needs a card-specific source window because its direct scan has
# a different layout from the sideways toploader pages.  Values are x, y,
# width, height in the upright working cell.
SAFE_CROP_OVERRIDES = {"A-B01-P5": (40, 0, 600, 683)}

# crop is expressed in the already upright per-position working cell.
TARGETS = [
    ("A-B03-P5", 3, 5, (35, 50, 500, 695)),
    ("A-B12-P5", 12, 5, (10, 90, 520, 723)),
    ("A-B13-P1", 13, 1, (190, 80, 505, 702)),
    ("A-B14-P6", 14, 6, (15, 105, 500, 695)),
    # Keep extra toploader/background around Lapras.  The previous crop ended
    # exactly on the card's right edge and made a complete card look clipped.
    ("A-B03-P4", 3, 4, (70, 120, 540, 674)),
    ("A-B07-P4", 7, 4, (100, 115, 505, 702)),
    ("A-B10-P6", 10, 6, (140, 115, 505, 702)),
    ("A-B16-P5", 16, 5, (55, 70, 520, 723)),
    ("A-B01-P5", 1, 5, (120, 20, 460, 640)),
    ("A-B05-P4", 5, 4, (90, 120, 500, 695)),
    ("A-B15-P1", 15, 1, (115, 80, 500, 695)),
    ("A-B15-P2", 15, 2, (110, 110, 505, 702)),
    ("A-B04-P6", 4, 6, (20, 120, 485, 674)),
    ("A-B09-P4", 9, 4, (25, 95, 505, 702)),
    ("A-B10-P5", 10, 5, (70, 105, 515, 716)),
    ("A-B13-P6", 13, 6, (70, 105, 500, 695)),
]


def working_cell(batch: int, position: int) -> Image.Image:
    scan = Image.open(SCANS / f"{batch}F.png").convert("RGB")
    width, height = scan.size
    column = (position - 1) % 2
    row = (position - 1) // 2

    # Batch 1 was scanned upright without the sideways toploader layout.
    if batch == 1:
        x0, x1 = ((0, width // 2) if column == 0 else (width // 2, width))
        y0, y1 = round(row * height / 3), round((row + 1) * height / 3)
        return scan.crop((x0, y0, x1, y1))

    # The remaining source pages hold two sideways cards per row.  Include a
    # small overlap around the column split so crop-regression cases remain
    # complete, then rotate clockwise to an upright review image.
    overlap = 70
    if column == 0:
        x0, x1 = 0, min(width, width // 2 + overlap)
    else:
        x0, x1 = max(0, width // 2 - overlap), width
    y0 = (0, 520, 1080)[row]
    cell = scan.crop((x0, y0, x1, min(height, y0 + 860)))
    return cell.transpose(Image.Transpose.ROTATE_270)


def safe_crop_box(
    card_id: str, cell: Image.Image, box: tuple[int, int, int, int]
) -> tuple[int, int, int, int]:
    if card_id in SAFE_CROP_OVERRIDES:
        x, y, width, height = SAFE_CROP_OVERRIDES[card_id]
        return x, y, x + width, y + height

    x, y, width, height = box
    return (
        max(0, x - SAFE_MARGIN),
        max(0, y - SAFE_MARGIN),
        min(cell.width, x + width + SAFE_MARGIN),
        min(cell.height, y + height + SAFE_MARGIN),
    )


def render_card(
    card_id: str, batch: int, position: int, box: tuple[int, int, int, int]
) -> Image.Image:
    source_position = SOURCE_POSITION_OVERRIDES.get(card_id, position)
    cell = working_cell(batch, source_position)

    if card_id in OPEN_SAFE_RECROP:
        crop_box = safe_crop_box(card_id, cell, box)
        crop = cell.crop(crop_box)
        fitted = ImageOps.contain(crop, CANVAS, Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", CANVAS, (247, 247, 247))
        canvas.paste(
            fitted,
            ((CANVAS[0] - fitted.width) // 2, (CANVAS[1] - fitted.height) // 2),
        )
        return canvas

    x, y, width, height = box
    card = cell.crop((x, y, x + width, y + height))
    if card_id == "A-B03-P4":
        # Preserve the wider source crop without stretching it.  Center it on
        # a fixed review canvas so all four physical edges remain visible.
        card.thumbnail(CANVAS, Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", CANVAS, (247, 247, 247))
        canvas.paste(
            card, ((CANVAS[0] - card.width) // 2, (CANVAS[1] - card.height) // 2)
        )
        return canvas
    return card.resize(CANVAS, Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=OUTPUT)
    parser.add_argument("--include-confirmed", action="store_true")
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    for card_id, batch, position, (x, y, width, height) in TARGETS:
        target = args.output_dir / f"{card_id}.jpg"
        if card_id in CONFIRMED_LOCKED and target.exists() and not args.include_confirmed:
            continue
        card = render_card(card_id, batch, position, (x, y, width, height))
        card.save(
            target,
            format="JPEG",
            quality=90,
            optimize=True,
            progressive=False,
            subsampling=1,
        )


if __name__ == "__main__":
    main()
