#!/usr/bin/env python3
"""
Auto-rename and organize earring images after manual download from Google Drive
After downloading the ZIP from Google Drive and extracting to src/assets/images/
Run: python auto_rename_earrings.py
"""

import os
import shutil
from pathlib import Path

# Mapping of Google Drive filenames to project filenames
RENAME_MAP = {
    "1.Kundan chanbali Earings.JPG": "1_kundan_chandbali_earrings.jpg",
    "1.kundan chanbali earings.jpg": "1_kundan_chandbali_earrings.jpg",  # lowercase variant
    "2.Kundan Dangler Earings.JPG": "2_kundan_dangler_earrings.jpg",
    "2.kundan dangler earings.jpg": "2_kundan_dangler_earrings.jpg",
    "3.Double hoop earings for a single piecering.JPG": "3_double_hoop_earrings.jpg",
    "3.double hoop earings for a single piecering.jpg": "3_double_hoop_earrings.jpg",
    "4.Gold Hoop-1.JPG": "4_gold_hoop_1.jpg",
    "4.gold hoop-1.jpg": "4_gold_hoop_1.jpg",
    "4.Gold Hoop-2.JPG": "4_gold_hoop_2.jpg",
    "4.gold hoop-2.jpg": "4_gold_hoop_2.jpg",
    "5.Gold plated pair earings combo set.JPG": "5_gold_plated_pair_earrings.jpg",
    "5.gold plated pair earings combo set.jpg": "5_gold_plated_pair_earrings.jpg",
    "6.Studs-1.JPG": "6_studs_1.jpg",
    "6.studs-1.jpg": "6_studs_1.jpg",
    "6.Studs-2.JPG": "6_studs_2.jpg",
    "6.studs-2.jpg": "6_studs_2.jpg",
    "6.Studs-3.JPG": "6_studs_3.jpg",
    "6.studs-3.jpg": "6_studs_3.jpg",
    "6.Studs-4.JPG": "6_studs_4.jpg",
    "6.studs-4.jpg": "6_studs_4.jpg",
    "6.Studs=5.JPG": "6_studs_5.jpg",
    "6.studs=5.jpg": "6_studs_5.jpg",
    "6.Studs-5.JPG": "6_studs_5.jpg",
    "6.studs-5.jpg": "6_studs_5.jpg",
    "7.Huggie earings with pearl and ball drops-1.JPG": "7_huggie_earrings_1.jpg",
    "7.huggie earings with pearl and ball drops-1.jpg": "7_huggie_earrings_1.jpg",
    "7.Huggie earings with pearl and ball drops-2.JPG": "7_huggie_earrings_2.jpg",
    "7.huggie earings with pearl and ball drops-2.jpg": "7_huggie_earrings_2.jpg",
    "8.Hoop and stud earings mutlipack combo set.JPG": "8_hoop_stud_earrings_combo.jpg",
    "8.hoop and stud earings mutlipack combo set.jpg": "8_hoop_stud_earrings_combo.jpg",
    "8.Hoop and stud earings multipack combo set.JPG": "8_hoop_stud_earrings_combo.jpg",
}

def main():
    images_dir = Path("src/assets/images")
    
    print("\n" + "=" * 80)
    print("🔄 AUTO-RENAME EARRING IMAGES")
    print("=" * 80)
    
    if not images_dir.exists():
        print(f"\n❌ Directory not found: {images_dir}")
        print("   Please download and extract images first!")
        return False
    
    # Find all image files
    all_files = list(images_dir.glob("*"))
    image_files = [f for f in all_files if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
    
    print(f"\n📁 Found {len(image_files)} image files in {images_dir}")
    
    # Try to rename
    renamed_count = 0
    skipped_count = 0
    errors = []
    
    for file_path in image_files:
        original_name = file_path.name
        
        # Check if it matches our mapping
        if original_name in RENAME_MAP:
            new_name = RENAME_MAP[original_name]
            new_path = file_path.parent / new_name
            
            try:
                if new_path.exists():
                    print(f"  ⏭️  SKIP: {original_name} (already exists as {new_name})")
                    skipped_count += 1
                else:
                    file_path.rename(new_path)
                    size_mb = new_path.stat().st_size / (1024 * 1024)
                    print(f"  ✓ RENAMED: {original_name} → {new_name} ({size_mb:.1f} MB)")
                    renamed_count += 1
            except Exception as e:
                errors.append((original_name, str(e)))
                print(f"  ❌ ERROR: {original_name} - {str(e)}")
        else:
            # Check if it's already in our target format
            if any(original_name.lower() == target.lower() for target in RENAME_MAP.values()):
                print(f"  ✓ OK: {original_name} (already in correct format)")
                skipped_count += 1
            else:
                print(f"  ❓ UNKNOWN: {original_name} (not in earring mapping)")
    
    # Verify all expected files exist
    print("\n" + "-" * 80)
    print("📋 VERIFICATION:")
    print("-" * 80)
    
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
    
    found_count = 0
    for expected in expected_files:
        if (images_dir / expected).exists():
            size_mb = (images_dir / expected).stat().st_size / (1024 * 1024)
            print(f"  ✓ {expected:<40} ({size_mb:>6.1f} MB)")
            found_count += 1
        else:
            print(f"  ✗ {expected:<40} (MISSING)")
    
    print("\n" + "=" * 80)
    print(f"📊 SUMMARY:")
    print("=" * 80)
    print(f"  Renamed: {renamed_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Found/Verified: {found_count}/14")
    
    if errors:
        print(f"  Errors: {len(errors)}")
        for file, error in errors:
            print(f"    - {file}: {error}")
    
    if found_count == 14:
        print("\n✅ SUCCESS! All 14 earring images are ready!")
        print("\n🚀 Next steps:")
        print("   1. Run: npm run build")
        print("   2. Run: npm run dev")
        print("   3. Visit: http://localhost:3000/#/shop?category=earrings")
        return True
    else:
        print(f"\n⚠️  Missing {14 - found_count} image(s)")
        print("   Please ensure all files are downloaded from Google Drive:")
        print("   https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm")
        return False
    
    print("\n" + "=" * 80 + "\n")

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
