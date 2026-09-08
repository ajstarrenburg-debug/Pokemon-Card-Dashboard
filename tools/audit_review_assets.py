"""Fail the release if a review crop or a confirmed Gold image regresses."""

from hashlib import sha256
from io import BytesIO
from pathlib import Path
import re

from PIL import Image

from build_review_assets import (
    CANVAS,
    CONFIRMED_LOCKED,
    OPEN_SAFE_RECROP,
    OUTPUT,
    SOURCE_POSITION_OVERRIDES,
    TARGETS,
    SCANS,
    render_card,
)


LOCKED_SHA256 = {
    "A-B03-P5": "70512ba1aedd03bbf4d922f8f62ed19037cbe5cd22a22e908f631ae212ee1509",
    "A-B12-P5": "96102ad21c846841d6d87ab4bedfebce157fcfa5664fcec4c157e6204c2ff1c6",
    "A-B13-P1": "8835de90f6baf8cc91867ee2325abec6f8225cbfc3ce1bd2e35d80085e9a1494",
    "A-B14-P6": "e023626cd49939aa39d3a8f347f6cf1a8332dbd5dff0b8e5e9903dbfd832ef97",
    "A-B03-P4": "b4055764841ed774055dc8acf72a1e8ab30f737c95f16562d628250b0c96503a",
    "A-B07-P4": "04d625ff084a8ba7a789333317be59c17a302af28b0554af32f13425ddc00790",
    "A-B10-P6": "2dca1fe7c6b01fccda5028a27957eba9db7176f5807151e71d71b423d27008ca",
    "A-B16-P5": "06b2fad8ed6afb3b9234d2c3b2e2c31b52ae1a8367e6fe1b54edb0125e697c44",
}

REVIEWED_CROP_SHA256 = {
    "A-B01-P5": "d36fb1fdc9ad94ba62a57f710f995d245cbfebad1d82c1e369a70e38219bd759",
    "A-B04-P6": "800971cdfe7e7aab6fa33814466c85dae581e47e359d4c7ef62078e060162f33",
    "A-B05-P4": "e617236befb7f470837ca2714e8ae15e6622aafcae040954abdf55df64e87696",
    "A-B09-P4": "270a29f6f85d326f1dc0723a126f2eda3ee173693fcf442f1d08ee4777feae13",
    "A-B10-P5": "56b3b3366a9c3965b7ae712ae496297d8795225d0038ad923a5666cb424c33ad",
    "A-B13-P6": "f714b17ca308624aa88802ec91cf61d556633741b9f3c3e98d0e7de2add0cbb8",
    "A-B15-P1": "997ed6884b091352a7189f2d44a983e87dfe928fa7e5a82e9b17702b418f26a7",
    "A-B15-P2": "ab0a329dae816f81c6d351c9b280484376b98aa2f5bef8d8baf30a634a076e5c",
}


def digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest()


def main() -> None:
    assert CONFIRMED_LOCKED.isdisjoint(OPEN_SAFE_RECROP)
    assert len(CONFIRMED_LOCKED | OPEN_SAFE_RECROP) == 16
    assert SOURCE_POSITION_OVERRIDES["A-B01-P5"] == 2

    targets = {card_id: values for card_id, *values in TARGETS}
    files = sorted(OUTPUT.glob("A-B*.jpg"))
    assert len(files) == 16, f"expected 16 review images, found {len(files)}"

    for path in files:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            assert image.size == CANVAS, (path.name, image.size)
            assert image.mode == "RGB", (path.name, image.mode)

    for card_id, expected in LOCKED_SHA256.items():
        assert digest(OUTPUT / f"{card_id}.jpg") == expected, (
            f"confirmed Gold image changed: {card_id}"
        )

    # CI checks the exact reviewed JPEGs even without the private source scans.
    assert set(REVIEWED_CROP_SHA256) == OPEN_SAFE_RECROP
    for card_id, expected in REVIEWED_CROP_SHA256.items():
        assert digest(OUTPUT / f"{card_id}.jpg") == expected, card_id

    # Locally also verify the complete source-to-JPEG mapping deterministically.
    source_checks = 0
    for card_id in OPEN_SAFE_RECROP:
        batch, position, box = targets[card_id]
        if not (SCANS / f"{batch}F.png").exists():
            continue  # Private source scans are intentionally absent from CI.
        expected = render_card(card_id, batch, position, box)
        encoded = BytesIO()
        expected.save(encoded, format="JPEG", quality=90, optimize=True, progressive=False, subsampling=1)
        assert encoded.getvalue() == (OUTPUT / f"{card_id}.jpg").read_bytes(), card_id
        source_checks += 1

    review_js = (OUTPUT.parent / "review.js").read_text(encoding="utf-8")
    for card_id in OPEN_SAFE_RECROP:
        match = re.search(
            rf"\{{card_id:'{re.escape(card_id)}'[^\n]+\}}", review_js
        )
        assert match, f"review seed missing: {card_id}"
        row = match.group(0)
        values = {
            key: float(value)
            for key, value in re.findall(
                r"\b(OL|OR|OT|OB):(-?\d+(?:\.\d+)?)", row
            )
        }
        assert "seed_revision:16" in row, f"asset revision missing: {card_id}"
        safe_margin = min(
            values["OL"], CANVAS[0] - values["OR"], values["OT"], CANVAS[1] - values["OB"]
        )
        assert safe_margin >= 50, (card_id, safe_margin)

    print(f"ASSET_AUDIT_OK 8 confirmed unchanged, 8 reviewed crops unchanged, {source_checks} source rebuilds checked")


if __name__ == "__main__":
    main()
