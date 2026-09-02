"""Build the 16 browser-safe Inner Review card images from the original scans.

The public review app deliberately uses ordinary baseline JPEG files.  Do not
replace them with a base64 payload or a sprite: those two shortcuts caused the
cross-browser failures this script was introduced to remove.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SCANS = ROOT.parent / "batch-scans" / "Pokemon"
OUTPUT = ROOT / "cards"

# crop is expressed in the already upright per-position working cell.
TARGETS = [
    ("A-B03-P5", 3, 5, (35, 50, 500, 695)),
    ("A-B12-P5", 12, 5, (10, 90, 520, 723)),
    ("A-B13-P1", 13, 1, (190, 80, 505, 702)),
    ("A-B14-P6", 14, 6, (15, 105, 500, 695)),
    ("A-B03-P4", 3, 4, (80, 125, 480, 667)),
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


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for card_id, batch, position, (x, y, width, height) in TARGETS:
        cell = working_cell(batch, position)
        card = cell.crop((x, y, x + width, y + height))
        card = card.resize((630, 880), Image.Resampling.LANCZOS)
        card.save(
            OUTPUT / f"{card_id}.jpg",
            format="JPEG",
            quality=90,
            optimize=True,
            progressive=False,
            subsampling=1,
        )


if __name__ == "__main__":
    main()
