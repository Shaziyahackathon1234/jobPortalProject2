from PIL import Image
import os, glob

os.makedirs("screens", exist_ok=True)
pages = sorted(glob.glob("imgs/page-*.png"), key=lambda p: int(''.join(filter(str.isdigit, os.path.basename(p)))))

idx = 0
results = []
for pg in pages:
    im = Image.open(pg).convert("L")
    W, H = im.size
    px = im.load()
    # rows that contain non-white content (screenshot bg gray ~249 < 252, page gap = 255)
    row_has = []
    for y in range(H):
        cnt = 0
        for x in range(0, W, 4):  # sample every 4px
            if px[x, y] < 252:
                cnt += 1
        row_has.append(cnt > (W/4) * 0.02)
    # group into bands, allowing small white gaps inside a screenshot
    bands = []
    y = 0
    GAP = 25  # rows of white needed to separate screenshots
    while y < H:
        if row_has[y]:
            start = y
            gap = 0
            while y < H and (row_has[y] or gap < GAP):
                gap = 0 if row_has[y] else gap + 1
                y += 1
            end = y - gap
            if end - start > 80:  # ignore tiny bands
                bands.append((start, end))
        else:
            y += 1
    color = Image.open(pg).convert("RGB")
    for (s, e) in bands:
        crop = color.crop((0, max(0, s-8), W, min(H, e+8)))
        # trim left/right white
        g = crop.convert("L")
        cw, ch = g.size
        gpx = g.load()
        left, right = cw, 0
        for x in range(cw):
            col = sum(1 for yy in range(0, ch, 4) if gpx[x, yy] < 252)
            if col > (ch/4)*0.02:
                left = min(left, x); right = max(right, x)
        if right > left:
            crop = crop.crop((max(0,left-8), 0, min(cw,right+8), ch))
        idx += 1
        fn = f"screens/screen-{idx:02d}.png"
        crop.save(fn)
        results.append((fn, crop.size))

for fn, sz in results:
    print(fn, sz)
