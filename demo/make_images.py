"""Draws the illustrated sample pictures used by the demo data (demo/demo-data.sql).

They are simple drawings, not photographs, so the demo never uses someone else's pictures.
    python3 demo/make_images.py demo/images
Needs Pillow (pip install pillow).
"""
import math, random, sys, pathlib
from PIL import Image, ImageDraw, ImageFilter

W, H, S = 1200, 800, 2          # size, and supersampling for smooth edges
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "demo/images")
out.mkdir(parents=True, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(top, bottom, horizon=0.62):
    im = Image.new("RGB", (W * S, H * S))
    d = ImageDraw.Draw(im)
    for y in range(H * S):
        d.line([(0, y), (W * S, y)], fill=lerp(top, bottom, min(1, y / (H * S * horizon))))
    return im


def sun(im, x, y, r, col=(255, 236, 190)):
    glow = Image.new("RGB", im.size, (0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse([x - r * 3, y - r * 3, x + r * 3, y + r * 3], fill=tuple(int(c * .5) for c in col))
    glow = glow.filter(ImageFilter.GaussianBlur(r * 1.4))
    im.paste(Image.eval(Image.blend(Image.new("RGB", im.size, (0, 0, 0)), glow, 1), lambda v: v), (0, 0), None) if False else None
    from PIL import ImageChops
    im.paste(ImageChops.add(im, glow))
    ImageDraw.Draw(im).ellipse([x - r, y - r, x + r, y + r], fill=col)


def hills(im, base, amp, col, seed, step=24):
    rnd = random.Random(seed)
    pts = [(0, H * S)]
    ph = [rnd.random() * 6 for _ in range(3)]
    for x in range(0, W * S + step, step):
        t = x / (W * S)
        y = base * H * S + sum(a * math.sin(t * f * 6.28 + p) for a, f, p in zip((amp, amp * .5, amp * .25), (1, 2.3, 5.1), ph)) * S
        pts.append((x, y))
    pts.append((W * S, H * S))
    ImageDraw.Draw(im).polygon(pts, fill=col)


def palm(d, x, y, h, lean, col=(40, 36, 30), leaf=(36, 104, 52)):
    pts = []
    for i in range(0, 21):
        t = i / 20
        pts.append((x + lean * t * t * h, y - h * t))
    d.line(pts, fill=col, width=int(h * .035))
    tx, ty = pts[-1]
    for k in range(9):
        a = math.radians(-160 + k * 40)
        L = h * .42
        ex, ey = tx + math.cos(a) * L, ty + math.sin(a) * L * .55 + L * .25
        mx, my = tx + math.cos(a) * L * .55, ty + math.sin(a) * L * .55 - L * .12
        d.line([(tx, ty), (mx, my), (ex, ey)], fill=leaf, width=max(2, int(h * .02)))
    d.ellipse([tx - h * .03, ty - h * .03, tx + h * .03, ty + h * .03], fill=col)


def save(im, name):
    im.resize((W, H), Image.LANCZOS).save(out / f"{name}.webp", quality=80)


def land_coconut():
    im = sky((255, 150, 90), (255, 214, 150))
    sun(im, int(W * S * .72), int(H * S * .5), 70 * S)
    hills(im, .56, 26, (96, 128, 98), 1)
    hills(im, .66, 20, (64, 120, 64), 2)
    hills(im, .78, 14, (48, 104, 52), 3)
    d = ImageDraw.Draw(im)
    for x, h, l in [(180, 330, .2), (330, 290, -.12), (860, 360, -.18), (1010, 300, .15), (520, 230, .1)]:
        palm(d, x * S, int(H * S * .84), h * S, l)
    save(im, "land-coconut")


def land_hill():
    im = sky((170, 200, 226), (236, 240, 236), .7)
    hills(im, .45, 40, (150, 176, 170), 4)
    hills(im, .56, 34, (104, 150, 112), 5)
    d = ImageDraw.Draw(im)
    hills(im, .7, 22, (60, 130, 70), 6)
    for i in range(14):      # tea rows
        y = int((.72 + i * .02) * H * S)
        d.line([(0, y), (W * S, y - 30 * S)], fill=(40 + i * 3, 112 + i * 3, 52), width=3 * S)
    save(im, "land-hill")


def land_water():
    im = sky((120, 190, 236), (226, 240, 250), .55)
    d = ImageDraw.Draw(im)
    d.rectangle([0, int(H * S * .55), W * S, H * S], fill=(54, 140, 190))
    for i in range(40):
        y = int(H * S * (.57 + i * .01))
        d.line([(0, y), (W * S, y)], fill=lerp((54, 140, 190), (30, 100, 160), i / 40), width=S * 2)
    sun(im, int(W * S * .3), int(H * S * .4), 50 * S, (255, 250, 220))
    d.polygon([(0, int(H * S * .86)), (W * S * .62, int(H * S * .8)), (W * S, int(H * S * .9)), (W * S, H * S), (0, H * S)], fill=(224, 200, 150))
    for x, h, l in [(150, 340, .15), (300, 270, -.1)]:
        palm(d, x * S, int(H * S * .9), h * S, l)
    save(im, "land-water")


def house():
    im = sky((140, 190, 235), (225, 238, 248), .7)
    hills(im, .6, 14, (96, 160, 100), 7)
    d = ImageDraw.Draw(im)
    d.rectangle([0, int(H * S * .72), W * S, H * S], fill=(88, 160, 84))
    x0, x1, y0, y1 = 300 * S, 900 * S, 330 * S, 640 * S
    d.rectangle([x0, y0, x1, y1], fill=(246, 238, 222))
    d.polygon([(x0 - 40 * S, y0), ((x0 + x1) // 2, 170 * S), (x1 + 40 * S, y0)], fill=(176, 84, 60))
    d.rectangle([(x0 + x1) // 2 - 50 * S, 450 * S, (x0 + x1) // 2 + 50 * S, y1], fill=(110, 74, 50))
    for wx in (350, 710):
        d.rectangle([wx * S, 400 * S, (wx + 140) * S, 520 * S], fill=(150, 200, 230), outline=(255, 255, 255), width=5 * S)
        d.line([((wx + 70) * S, 400 * S), ((wx + 70) * S, 520 * S)], fill=(255, 255, 255), width=4 * S)
    d.rectangle([0, int(H * S * .86), W * S, int(H * S * .9)], fill=(200, 196, 190))
    palm(d, 1040 * S, 650 * S, 330 * S, -.12)
    save(im, "house")


def apartment():
    im = sky((90, 150, 220), (210, 232, 250), .8)
    d = ImageDraw.Draw(im)
    for x, w, h, c in [(120, 220, 420, (176, 192, 210)), (880, 240, 480, (190, 202, 218))]:
        d.rectangle([x * S, (700 - h) * S, (x + w) * S, 700 * S], fill=c)
    bx0, bx1, by0 = 420 * S, 780 * S, 90 * S
    d.rectangle([bx0, by0, bx1, 700 * S], fill=(236, 240, 246))
    d.rectangle([bx1, by0 + 14 * S, bx1 + 40 * S, 700 * S], fill=(196, 204, 218))
    for r in range(15):
        for c in range(5):
            x = bx0 + (28 + c * 66) * S
            y = by0 + (24 + r * 38) * S
            d.rectangle([x, y, x + 44 * S, y + 24 * S], fill=(110, 164, 214) if (r + c) % 5 else (255, 226, 150))
    d.rectangle([0, 700 * S, W * S, H * S], fill=(84, 150, 84))
    d.rectangle([0, 740 * S, W * S, 770 * S], fill=(120, 124, 130))
    save(im, "apartment")


def plan():
    im = Image.new("RGB", (W * S, H * S), (244, 247, 244))
    d = ImageDraw.Draw(im)
    d.rectangle([40 * S, 40 * S, (W - 40) * S, (H - 40) * S], outline=(60, 90, 70), width=4 * S)
    d.rectangle([40 * S, 360 * S, (W - 40) * S, 440 * S], fill=(200, 200, 200))
    n = 0
    for row, y in enumerate((90, 470)):
        for c in range(6):
            x = 80 + c * 175
            col = [(198, 232, 200), (252, 226, 170), (232, 150, 140)][(n * 7) % 3 if n % 5 else 0]
            d.rectangle([x * S, y * S, (x + 150) * S, (y + 230) * S], fill=col, outline=(60, 90, 70), width=2 * S)
            n += 1
    save(im, "plan")


for f in (land_coconut, land_hill, land_water, house, apartment, plan):
    f()
print("wrote", len(list(out.glob("*.webp"))), "pictures to", out)
