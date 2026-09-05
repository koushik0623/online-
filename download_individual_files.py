#!/usr/bin/env python3
"""
Download individual earring images from Google Drive using gdown
Before running: pip install gdown
Run: python download_individual_files.py
"""

import os
from pathlib import Path

# Google Drive folder ID
FOLDER_ID = "14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm"

# Create output directory
images_dir = Path("src/assets/images")
images_dir.mkdir(parents=True, exist_ok=True)

print("\n" + "=" * 80)
print("📥 GOOGLE DRIVE EARRING IMAGES DOWNLOADER")
print("=" * 80)

print(f"""
🔗 Google Drive Folder: https://drive.google.com/drive/folders/{FOLDER_ID}

📍 Destination: {images_dir}

⚠️  IMPORTANT - Choose one method:

METHOD 1 - Automatic Download (Requires Authentication):
   pip install gdown
   gdown --folder --id {FOLDER_ID} -O {images_dir}/ --quiet

METHOD 2 - Manual Download (Easiest):
   1. Visit: https://drive.google.com/drive/folders/{FOLDER_ID}
   2. Ctrl+A to select all files
   3. Right-click → Download
   4. Extract ZIP to: {images_dir}/
   5. Files will auto-organize

METHOD 3 - Using Python (After Download):
   1. Download ZIP from Google Drive
   2. Extract to: {images_dir}/
   3. Run: python rename_earring_files.py

📋 Expected Files After Download:
   - 1.Kundan chanbali Earings.JPG (2.6 MB)
   - 2.Kundan Dangler Earings.JPG (2.6 MB)
   - 3.Double hoop earings for a single piecering.JPG (1.8 MB)
   - 4.Gold Hoop-1.JPG (2.2 MB)
   - 4.Gold Hoop-2.JPG (2.1 MB)
   - 5.Gold plated pair earings combo set.JPG (2.1 MB)
   - 6.Studs-1.JPG (2.3 MB)
   - 6.Studs-2.JPG (2.1 MB)
   - 6.Studs-3.JPG (2.2 MB)
   - 6.Studs-4.JPG (2.8 MB)
   - 6.Studs=5.JPG (2.8 MB)
   - 7.Huggie earings with pearl and ball drops-1.JPG
   - 7.Huggie earings with pearl and ball drops-2.JPG
   - 8.Hoop and stud earings mutlipack combo set.JPG

✅ AFTER DOWNLOADING:
   1. npm run build
   2. npm run dev
   3. Check: http://localhost:3000/#/shop?category=earrings

🎯 Your website is already configured to display these images!
   Just download and place them in: {images_dir}/

""")

print("=" * 80 + "\n")

# Try to import gdown and download automatically
try:
    import gdown
    print("✅ gdown is installed. Attempting to download folder...\n")
    
    url = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
    gdown.download_folder(url=url, output=str(images_dir), quiet=False, use_cookies=False)
    
    print("\n✅ Download completed!")
    
    # List downloaded files
    files = list(images_dir.glob("*"))
    print(f"\n📁 Downloaded {len(files)} files:")
    for f in sorted(files):
        if f.is_file():
            size_mb = f.stat().st_size / (1024 * 1024)
            print(f"   ✓ {f.name} ({size_mb:.1f} MB)")
    
except ImportError:
    print("⚠️  gdown is not installed.")
    print("\nTo install: pip install gdown\n")
    
except Exception as e:
    print(f"⚠️  Error: {str(e)}")
    print("\n💡 Use METHOD 2 (Manual Download) instead")
