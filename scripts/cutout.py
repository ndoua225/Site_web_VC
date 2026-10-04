from PIL import Image, ImageDraw, ImageFilter, ImageChops
im = Image.open("bj-1.png").convert("RGB")
w, h = im.size
print(w, h, [im.getpixel(p) for p in [(5,5),(w-5,5),(5,h//2),(w//2,5),(w-5,h//2)]])
# flood fill background from the borders on a marker copy
marker = im.copy()
MAGENTA = (255, 0, 255)
thr = 38
seeds = [(x, 0) for x in range(0, w, 6)] + [(185, 466), (188, 445)] + [(0, y) for y in range(0, h, 6)] + [(w-1, y) for y in range(0, h, 6)]
for s in seeds:
    if marker.getpixel(s) != MAGENTA:
        ImageDraw.floodfill(marker, s, MAGENTA, thresh=thr)
mask = Image.new("L", (w, h), 255)
px, mp = mask.load(), marker.load()
for y in range(h):
    for x in range(w):
        if mp[x, y] == MAGENTA:
            px[x, y] = 0
# clean: remove specks, smooth edge
mask = mask.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MinFilter(3))
mask = mask.filter(ImageFilter.GaussianBlur(1.2))
mask = mask.point(lambda v: 0 if v < 110 else (255 if v > 170 else int((v-110)*255/60)))
out = im.convert("RGBA"); out.putalpha(mask)
out.save("assets/stanislas.png")
prev = Image.new("RGBA", out.size, (90, 60, 220, 255)); prev.alpha_composite(out)
prev.save("scripts/preview.png")


