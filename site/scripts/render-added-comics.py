"""Typeset short Traditional Chinese dialogue into detected blank speech balloons."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "lib" / "added-comics.json"
OUT = ROOT / "public" / "media" / "comics" / "added"
FONT_PATH = Path(r"C:\Windows\Fonts\msyh.ttc")

SOURCES = {
    "civics-find-ai": Path(r"C:\Users\user\Desktop\AK Wealth Global 漫畫首批\Alice-Q1-家裡藏了幾個AI-插畫.png"),
    "oasis-golden-wedding-photo": Path(r"C:\Users\user\Desktop\AK Wealth Global 漫畫首批\Alice-O01-五十年前沒拍的婚紗照-插畫.png"),
    "ken-ka01-pig-umbrella": Path(r"C:\Users\user\Desktop\AK Wealth Global 漫畫首批\Ken-KA01-小豬的雨傘-插畫.png"),
    "oasis-letter-to-late-spouse": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第二批\Alice-O05-寫一封信給老伴.png"),
    "oasis-romance-scam": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第二批\Alice-O11-網路上的溫柔醫生.png"),
    "oasis-life-advice-capsule": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第二批\Alice-O12-阿公的人生錦囊.png"),
    "oasis-dream-career-photo": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第三批\Alice-O02-當年沒走的那條路.png"),
    "oasis-oldies-room": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第三批\Alice-O03-點點老歌房.png"),
    "oasis-my-melody": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第三批\Alice-O04-我的專屬旋律.png"),
    "ken-kb09-class-ball": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第二批\Ken-KB09-全班合買一顆球.png"),
    "ken-ka02-basket-eggs": Path(r"C:\Users\user\Desktop\AK Wealth Global 追加漫畫第三批\Ken-KA02-雞蛋別放同一個籃子.png"),
}

# The source images have visibly uneven panel rows. These are the midpoints of
# the black horizontal gutters, measured from each supplied blank illustration.
ROW_SPLITS = {
    "civics-find-ai": (456, 929),
    "oasis-golden-wedding-photo": (457, 919),
    "ken-ka01-pig-umbrella": (455, 974),
    "oasis-letter-to-late-spouse": (480, 955),
    "oasis-romance-scam": (454, 955),
    "oasis-life-advice-capsule": (423, 881),
    "oasis-dream-career-photo": (438, 913),
    "oasis-oldies-room": (468, 962),
    "oasis-my-melody": (461, 974),
    "ken-kb09-class-ball": (432, 919),
    "ken-ka02-basket-eggs": (483, 941),
}


def wrap_chars(draw, text, font, max_width):
    lines, current = [], ""
    for char in text:
        candidate = current + char
        if current and draw.textlength(candidate, font=font) > max_width:
            if char in "，。！？；：、）》」』】”’" and len(current) > 1:
                lines.append(current[:-1])
                current = current[-1] + char
            else:
                lines.append(current)
                current = char
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines or [""]


def find_bubbles(panel):
    """Find enclosed pale speech balloons in the original blank artwork."""
    gray = panel.convert("L")
    pixels = gray.load()
    width, height = gray.size
    seen = bytearray(width * height)
    regions = []
    for y in range(height):
        for x in range(width):
            start = y * width + x
            if seen[start] or pixels[x, y] < 242:
                continue
            stack = [start]
            seen[start] = 1
            min_x = max_x = x
            min_y = max_y = y
            area = 0
            touches_edge = False
            while stack:
                index = stack.pop()
                py, px = divmod(index, width)
                area += 1
                min_x, max_x = min(min_x, px), max(max_x, px)
                min_y, max_y = min(min_y, py), max(max_y, py)
                touches_edge |= px < 2 or py < 2 or px >= width - 2 or py >= height - 2
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        neighbor = ny * width + nx
                        if not seen[neighbor] and pixels[nx, ny] >= 242:
                            seen[neighbor] = 1
                            stack.append(neighbor)
            box_width = max_x - min_x + 1
            box_height = max_y - min_y + 1
            ratio = box_width / max(1, box_height)
            if area > 500 and area < width * height * 0.35 and box_width > 42 and box_height > 20 and 1.05 < ratio < 6.5:
                regions.append((area, (min_x + 7, min_y + 5, max_x - 7, max_y - 5)))
    return [bounds for _, bounds in sorted(regions, reverse=True)]


def render_dialogue(panel, text, bounds):
    left, top, right, bottom = bounds
    if right <= left or bottom <= top:
        return
    draw = ImageDraw.Draw(panel)
    max_width = right - left - 12
    chosen = None
    wrapped = None
    for size in range(min(20, bottom - top - 16), 11, -1):
        font = ImageFont.truetype(str(FONT_PATH), size)
        lines = wrap_chars(draw, text, font, max_width)
        if len(lines) * (size + 4) <= bottom - top - 14:
            chosen, wrapped = font, lines
            break
    if chosen is None:
        chosen = ImageFont.truetype(str(FONT_PATH), 11)
        wrapped = wrap_chars(draw, text, chosen, max_width)
    line_height = chosen.size + 4
    y = top + max(4, (bottom - top - len(wrapped) * line_height) // 2)
    for line in wrapped:
        draw.text((left, y), line, font=chosen, fill="#17212a")
        y += line_height


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    comics = json.loads(DATA.read_text(encoding="utf-8"))
    missing = []
    for comic in comics:
        source_path = SOURCES[comic["slug"]]
        if not source_path.is_file():
            raise FileNotFoundError(source_path)
        source = Image.open(source_path).convert("RGB")
        if source.size != (1024, 1536):
            raise ValueError(f"Unexpected source size for {comic['slug']}: {source.size}")
        for index, panel_data in enumerate(comic["panels"]):
            row, col = divmod(index, 2)
            splits = ROW_SPLITS[comic["slug"]]
            row_bounds = ((0, splits[0] - 6), (splits[0] + 6, splits[1] - 6), (splits[1] + 6, source.height))
            y0, y1 = row_bounds[row]
            crop = source.crop((col * 512 + 5, y0, (col + 1) * 512 - 5, y1))
            bubbles = find_bubbles(crop)
            if bubbles:
                dialogue = panel_data["overlay"].split("：", 1)[-1] if "：" in panel_data["overlay"] else panel_data["overlay"]
                render_dialogue(crop, dialogue, bubbles[0])
            else:
                missing.append(f"{comic['code']} panel {index + 1}")
            square = ImageOps.pad(crop, (502, 502), method=Image.Resampling.LANCZOS, color="#fffefa")
            square.save(OUT / f"{comic['slug']}-{index + 1}.webp", "WEBP", quality=89, method=6)
        print(f"Rendered {comic['slug']} (6 panels)")
    if missing:
        print("No reliable blank speech balloon detected for: " + ", ".join(missing))


if __name__ == "__main__":
    main()
