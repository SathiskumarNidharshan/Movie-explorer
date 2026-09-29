from pathlib import Path
from PIL import Image, ImageDraw

public = Path('public')


def make_icon(size: int, path: Path) -> Image.Image:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    amber = (245, 165, 36, 255)
    dark = (18, 14, 5, 255)
    radius = int(size * 0.25)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=amber)

    pad = size * 0.18
    x0, y0 = pad, pad
    x1, y1 = size - pad, size - pad
    body_top = y0 + size * 0.18
    draw.rounded_rectangle(
        [x0, body_top, x1, y1], radius=max(2, int(size * 0.06)), fill=dark
    )

    teeth = 5
    tooth_w = (x1 - x0) / teeth
    for i in range(teeth):
        tx0 = x0 + i * tooth_w
        mid = tx0 + tooth_w / 2
        if i % 2 == 0:
            draw.polygon(
                [(tx0, body_top), (mid, y0), (tx0 + tooth_w, body_top)], fill=dark
            )
        else:
            draw.polygon(
                [
                    (tx0, y0 + size * 0.04),
                    (mid, body_top),
                    (tx0 + tooth_w, y0 + size * 0.04),
                ],
                fill=amber,
            )

    def star(cx, cy, s):
        draw.polygon(
            [
                (cx, cy - s),
                (cx + s * 0.3, cy - s * 0.3),
                (cx + s, cy),
                (cx + s * 0.3, cy + s * 0.3),
                (cx, cy + s),
                (cx - s * 0.3, cy + s * 0.3),
                (cx - s, cy),
                (cx - s * 0.3, cy - s * 0.3),
            ],
            fill=amber,
        )

    star(size * 0.42, size * 0.58, size * 0.06)
    star(size * 0.68, size * 0.48, size * 0.035)

    img.save(path)
    return img


img32 = make_icon(32, public / 'favicon-32.png')
make_icon(192, public / 'logo192.png')
make_icon(512, public / 'logo512.png')
img32.save(public / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32)])
print('icons written')
