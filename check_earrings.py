#!/usr/bin/env python3
"""
Quick verification script to check if all earring images are downloaded
Run: python check_earrings.py
"""

from pathlib import Path
import os

# Define expected files
EXPECTED_EARRING_FILES = {
    "1_kundan_chandbali_earrings.jpg": "Product 1: Kundan Chandbali Earrings (SPK-ER-401)",
    "2_kundan_dangler_earrings.jpg": "Product 2: Kundan Dangler Earrings (SPK-ER-402)",
    "3_double_hoop_earrings.jpg": "Product 3: Double Hoop Earrings (SPK-ER-403)",
    "4_gold_hoop_1.jpg": "Product 4: Gold Hoop Set (SPK-ER-404) - Image 1",
    "4_gold_hoop_2.jpg": "Product 4: Gold Hoop Set (SPK-ER-404) - Image 2",
    "5_gold_plated_pair_earrings.jpg": "Product 5: Gold Plated Pair Combo (SPK-ER-405)",
    "6_studs_1.jpg": "Product 6: Studs Multipack (SPK-ER-406) - Image 1",
    "6_studs_2.jpg": "Product 6: Studs Multipack (SPK-ER-406) - Image 2",
    "6_studs_3.jpg": "Product 6: Studs Multipack (SPK-ER-406) - Image 3",
    "6_studs_4.jpg": "Product 6: Studs Multipack (SPK-ER-406) - Image 4",
    "6_studs_5.jpg": "Product 6: Studs Multipack (SPK-ER-406) - Image 5",
    "7_huggie_earrings_1.jpg": "Product 7: Huggie Earrings (SPK-ER-407) - Image 1",
    "7_huggie_earrings_2.jpg": "Product 7: Huggie Earrings (SPK-ER-407) - Image 2",
    "8_hoop_stud_earrings_combo.jpg": "Product 8: Hoop & Stud Combo (SPK-ER-408)",
}

images_dir = Path("src/assets/images")

print("\n" + "=" * 70)
print("🎯 EARRINGS IMAGES VERIFICATION")
print("=" * 70)

if not images_dir.exists():
    print(f"\n❌ ERROR: Directory does not exist: {images_dir}")
    print(f"\n📂 Create it: mkdir -p {images_dir}")
    exit(1)

found_files = set(f.name.lower() for f in images_dir.glob("*") if f.is_file())
expected_files = set(EXPECTED_EARRING_FILES.keys())

print(f"\n📂 Checking directory: {images_dir}")
print(f"📊 Expected files: {len(EXPECTED_EARRING_FILES)}")
print(f"📊 Found files: {len([f for f in images_dir.glob('*') if f.is_file()])}")

missing = expected_files - found_files
found_correct = expected_files & found_files

print("\n" + "-" * 70)
print("✅ FILES FOUND:")
print("-" * 70)

for filename in sorted(found_correct):
    product_info = EXPECTED_EARRING_FILES[filename]
    file_path = images_dir / filename
    size_mb = file_path.stat().st_size / (1024 * 1024)
    print(f"  ✓ {filename:<40} | {product_info} | {size_mb:.2f} MB")

if missing:
    print("\n" + "-" * 70)
    print("❌ MISSING FILES:")
    print("-" * 70)
    for filename in sorted(missing):
        product_info = EXPECTED_EARRING_FILES[filename]
        print(f"  ✗ {filename:<40} | {product_info}")
    
    print(f"\n⚠️  Missing {len(missing)} of {len(EXPECTED_EARRING_FILES)} files")
    print("\n📥 Download instructions:")
    print("   1. Open: https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm")
    print("   2. Select All (Ctrl+A)")
    print("   3. Download → Extract to src/assets/images/")
    print("   4. Rename files to match expected names above")
else:
    print("\n" + "=" * 70)
    print("🎉 ALL EARRING IMAGES FOUND! Ready to build!")
    print("=" * 70)
    print("\n✅ Next steps:")
    print("   1. npm run build")
    print("   2. npm run dev")
    print("   3. Navigate to /shop to see your earrings!")

print("\n" + "=" * 70 + "\n")
