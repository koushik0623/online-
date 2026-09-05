#!/usr/bin/env python3
"""
Download real earring images from Google Drive and replace placeholders
Run: python download_real_images.py
"""

import os
import shutil
from pathlib import Path

# List of 14 earring images from Google Drive folder
# These are the actual filenames from the drive
EARRING_FILES = [
    "1.Kundan chanbali Earings.JPG",
    "2.Kundan Dangler Earings.JPG",
    "3.Double hoop earings for a single piecering.JPG",
    "4.Gold Hoop-1.JPG",
    "4.Gold Hoop-2.JPG",
    "5.Gold plated pair earings combo set.JPG",
    "6.Studs-1.JPG",
    "6.Studs-2.JPG",
    "6.Studs-3.JPG",
    "6.Studs-4.JPG",
    "6.Studs=5.JPG",
    "7.Huggie earings with pearl and ball drops-1.JPG",
    "7.Huggie earings with pearl and ball drops-2.JPG",
    "8.Hoop and stud earings mutlipack combo set.JPG",
]

# Mapping to local filenames
LOCAL_MAPPING = {
    "1.Kundan chanbali Earings.JPG": "1_kundan_chandbali_earrings.jpg",
    "2.Kundan Dangler Earings.JPG": "2_kundan_dangler_earrings.jpg",
    "3.Double hoop earings for a single piecering.JPG": "3_double_hoop_earrings.jpg",
    "4.Gold Hoop-1.JPG": "4_gold_hoop_1.jpg",
    "4.Gold Hoop-2.JPG": "4_gold_hoop_2.jpg",
    "5.Gold plated pair earings combo set.JPG": "5_gold_plated_pair_earrings.jpg",
    "6.Studs-1.JPG": "6_studs_1.jpg",
    "6.Studs-2.JPG": "6_studs_2.jpg",
    "6.Studs-3.JPG": "6_studs_3.jpg",
    "6.Studs-4.JPG": "6_studs_4.jpg",
    "6.Studs=5.JPG": "6_studs_5.jpg",
    "7.Huggie earings with pearl and ball drops-1.JPG": "7_huggie_earrings_1.jpg",
    "7.Huggie earings with pearl and ball drops-2.JPG": "7_huggie_earrings_2.jpg",
    "8.Hoop and stud earings mutlipack combo set.JPG": "8_hoop_stud_earrings_combo.jpg",
}

FOLDER_ID = "14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm"

print("\n" + "=" * 80)
print("📥 DOWNLOAD REAL EARRING IMAGES FROM GOOGLE DRIVE")
print("=" * 80)

print(f"""
Google Drive Folder: https://drive.google.com/drive/folders/{FOLDER_ID}

Total Files to Download: {len(EARRING_FILES)}

📋 FILES:
""")

for i, (original, local) in enumerate(LOCAL_MAPPING.items(), 1):
    print(f"  {i:2d}. {original:<45} → {local}")

print(f"""
✅ SETUP INSTRUCTIONS:

To download these images, use ONE of these methods:

METHOD 1 (Easiest - Manual Download):
   1. Open: https://drive.google.com/drive/folders/{FOLDER_ID}
   2. Select All (Ctrl+A)
   3. Download → Save ZIP → Extract to: src/assets/images/
   4. Rename files to match the "local" names above
   5. Run: npm run build

METHOD 2 (Automated - Using gdown):
   pip install gdown
   gdown --folder https://drive.google.com/drive/folders/{FOLDER_ID} -O src/assets/images/ --quiet
   
METHOD 3 (Download Individual Files):
   pip install gdown
   python download_individual.py

📂 PROJECT STRUCTURE:
   src/assets/images/
   ├── 1_kundan_chandbali_earrings.jpg
   ├── 2_kundan_dangler_earrings.jpg
   ├── 3_double_hoop_earrings.jpg
   ├── 4_gold_hoop_1.jpg
   ├── 4_gold_hoop_2.jpg
   ├── 5_gold_plated_pair_earrings.jpg
   ├── 6_studs_1.jpg through 6_studs_5.jpg
   ├── 7_huggie_earrings_1.jpg
   ├── 7_huggie_earrings_2.jpg
   └── 8_hoop_stud_earrings_combo.jpg

🎯 BUILD & DEPLOY:
   npm run build
   npm run dev

Status: ✅ Ready to download!
""")

print("=" * 80 + "\n")
