from PIL import Image, ImageDraw
import math

size = 1024
img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
# diagonal gradient
grad = Image.new("RGBA", (size, size))
px = grad.load()
for y in range(size):
    for x in range(size):
        t = (x + y) / (2 * (size - 1))
        r = int(52 + (14 - 52) * t)
        g = int(211 + (165 - 211) * t)
        b = int(153 + (233 - 153) * t)
        px[x, y] = (r, g, b, 255)

mask = Image.new("L", (size, size), 0)
d = ImageDraw.Draw(mask)
d.rounded_rectangle([0, 0, size - 1, size - 1], radius=228, fill=255)
img.paste(grad, (0, 0), mask)

# subtle top highlight
hl = Image.new("RGBA", (size, size), (0, 0, 0, 0))
d2 = ImageDraw.Draw(hl)
d2.ellipse([-260, -620, size + 260, 420], fill=(255, 255, 255, 34))
img = Image.alpha_composite(img, Image.composite(hl, Image.new("RGBA", (size,size), (0,0,0,0)), mask))

# white check
d3 = ImageDraw.Draw(img)
points = [(275, 535), (450, 710), (765, 345)]
d3.line(points, fill=(255, 255, 255, 255), width=90, joint="curve")
for p in points:
    d3.ellipse([p[0]-45, p[1]-45, p[0]+45, p[1]+45], fill=(255, 255, 255, 255))

img = img.resize((256, 256), Image.LANCZOS)
img.save(r"M:\github\SPM Plan Desktop\src\app.ico", sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
img.save(r"M:\github\SPM Plan Desktop\src\app.png")
print("icon written")
