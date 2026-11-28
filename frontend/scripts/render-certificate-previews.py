"""
render-certificate-previews.py — Turn certificate PDFs into preview images

WHY THIS EXISTS:
  The homepage shows every certificate as a picture on the "certificate
  wall", so a visitor sees it without clicking. Browsers can't draw a PDF
  as an <img>, so this script renders the first page of each PDF in
  files/certificates/ to a JPEG in files/certificates/previews/.

  Images (.webp, .png, .jpg) are already pictures and are skipped: the
  page uses them directly.

USAGE (from frontend/):
  python -m pip install pymupdf          # once; any venv is fine
  python scripts/render-certificate-previews.py
  pnpm files:upload                      # copy the previews to R2

  Then point the certificate's `preview` field in src/data/portfolio.data.ts
  at /files/certificates/previews/<same name>.jpg

Re-running is safe: existing previews are overwritten.
"""

from pathlib import Path
import sys

try:
    import pymupdf  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is missing: run `python -m pip install pymupdf` first.")

ROOT = Path(__file__).resolve().parent.parent / "files" / "certificates"
OUT = ROOT / "previews"
WIDTH = 1200  # px; wide enough for a sharp card on a retina screen
QUALITY = 82  # JPEG quality: certificates are mostly flat colour and text


def render(pdf: Path) -> Path:
    with pymupdf.open(pdf) as doc:
        page = doc[0]
        zoom = WIDTH / page.rect.width
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        target = OUT / f"{pdf.stem}.jpg"
        pixmap.save(target, jpg_quality=QUALITY)
        return target


def main() -> None:
    OUT.mkdir(exist_ok=True)
    pdfs = sorted(ROOT.glob("*.pdf"))
    if not pdfs:
        print(f"No PDFs in {ROOT}")
        return
    for pdf in pdfs:
        target = render(pdf)
        print(f"{pdf.name:60} -> previews/{target.name} ({target.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
