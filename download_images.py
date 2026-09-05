#!/usr/bin/env python3
"""
Download earring images from Google Drive folder
Run: python download_images.py
"""

import os
import sys
from pathlib import Path

# Create directories
images_dir = Path("src/assets/images")
images_dir.mkdir(parents=True, exist_ok=True)

print("=" * 70)
print("📷 EARRINGS IMAGE DOWNLOADER")
print("=" * 70)

print("""
📍 Google Drive Folder: https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm

🖼️  Images Found (14 total):
   1. 1.Kundan chandbali Earings.JPG
   2. 2.Kundan Dangler Earrings.JPG
   3. 3.Double hoop earrings for a single piercing.JPG
   4. 4.Gold Hoop-1.JPG
   5. 4.Gold Hoop-2.JPG
   6. 5.Gold plated pair earrings combo set.JPG
   7. 6.Studs-1.JPG
   8. 6.Studs-2.JPG
   9. 6.Studs-3.JPG
  10. 6.Studs-4.JPG
  11. 6.Studs-5.JPG
  12. 7.Huggie earrings with pearl and ball drops-1.JPG
  13. 7.Huggie earrings with pearl and ball drops-2.JPG
  14. 8.Hoop and stud earrings multipack combo set.JPG

📂 Download Destination: {}/

✅ SETUP INSTRUCTIONS:
   1. Open: https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm
   2. Select ALL files (Ctrl+A)
   3. Click: Download (right-click → Download)
   4. Extract the ZIP to: src/assets/images/

🎯 Alternative (Automated):
   pip install gdown
   gdown --folder https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm -O src/assets/images/

📋 Files will be organized as:
""".format(images_dir))

expected_files = [
    "1_kundan_chandbali_earrings.jpg",
    "2_kundan_dangler_earrings.jpg", 
    "3_double_hoop_earrings.jpg",
    "4_gold_hoop_1.jpg",
    "4_gold_hoop_2.jpg",
    "5_gold_plated_pair_earrings.jpg",
    "6_studs_1.jpg",
    "6_studs_2.jpg",
    "6_studs_3.jpg",
    "6_studs_4.jpg",
    "6_studs_5.jpg",
    "7_huggie_earrings_1.jpg",
    "7_huggie_earrings_2.jpg",
    "8_hoop_stud_earrings_combo.jpg",
]

for i, fname in enumerate(expected_files, 1):
    print(f"   {i:2d}. {fname}")

print("\n" + "=" * 70)
