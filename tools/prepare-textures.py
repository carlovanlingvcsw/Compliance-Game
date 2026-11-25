# Maakt de webversies van de texturen: per textuur color.jpg, normal.jpg en orm.jpg (R = ao, G = ruwheid, B = metaal).
# Gebruik: python3 tools/prepare-textures.py <map met de uitgepakte texturen, zie assets/textures/CREDITS.md>
# Bron: ambientCG, CC0 1.0. Zie assets/textures/CREDITS.md.
import sys, os
from PIL import Image, ImageEnhance, ImageOps

src = os.path.join(sys.argv[1], "assets", "textures")
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "textures")
SIZE = 512

def load(name, m, mode):
    p = os.path.join(src, name, m + ".jpg")
    return Image.open(p).convert(mode).resize((SIZE, SIZE), Image.LANCZOS) if os.path.exists(p) else None

def tone(im, name):
    if name == "hull_light":            # het origineel is donker blauwgrijs: structuur houden, licht maken
        g = ImageOps.autocontrast(im.convert("L"), cutoff=1)
        return ImageOps.colorize(g, (158, 168, 184), (214, 222, 232))
    if name == "hull_dark":             # het origineel is bijna zwart: structuur houden, blauwgrijs maken
        g = ImageOps.autocontrast(im.convert("L"), cutoff=1)
        return ImageOps.colorize(g, (58, 72, 96), (98, 114, 140))
    if name == "hull_white":            # schoon wit voor de ziekenboeg, slijtage alleen als zachte tekening
        g = ImageOps.autocontrast(im.convert("L"), cutoff=1)
        return ImageOps.colorize(g, (196, 206, 218), (240, 244, 248))
    if name == "container":
        return ImageEnhance.Brightness(im).enhance(1.45)
    if name == "scifi_panel":
        return ImageEnhance.Brightness(im).enhance(1.5)
    if name in ("rubber_floor", "heat_shield"):  # bijna zwart in het origineel: lichter, zodat een tint werkt
        return ImageEnhance.Brightness(im).enhance(2.6)
    if name == "truss":
        return ImageEnhance.Brightness(im).enhance(1.2)
    return im

total = 0
for name in sorted(os.listdir(src)):
    d = os.path.join(out, name); os.makedirs(d, exist_ok=True)
    color = tone(load(name, "color", "RGB"), name)
    normal = load(name, "normal", "RGB")
    ao = load(name, "ao", "L") or Image.new("L", (SIZE, SIZE), 255)
    rough = load(name, "roughness", "L"); metal = load(name, "metalness", "L") or Image.new("L", (SIZE, SIZE), 0)  # geen kaart: niet-metaal
    orm = Image.merge("RGB", (ao, rough, metal))
    for im, fn, q in ((color, "color", 84), (normal, "normal", 88), (orm, "orm", 82)):
        p = os.path.join(d, fn + ".jpg"); im.save(p, quality=q, optimize=True); total += os.path.getsize(p)
print("klaar:", round(total / 1024), "kB")
