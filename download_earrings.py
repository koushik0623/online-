import gdown
import os
from pathlib import Path

# Create images directories
images_dir = Path("src/assets/images")
images_dir.mkdir(parents=True, exist_ok=True)

# Also create the root images folder for build output
root_images_dir = Path("images")
root_images_dir.mkdir(parents=True, exist_ok=True)

# Google Drive folder ID from the URL: https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm
folder_id = "14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm"

# Files to download with their local names
earring_files = {
    "1_kundan_chandbali_earrings.jpg": "1.Kundan chandbali Earings.JPG",
    "2_kundan_dangler_earrings.jpg": "2.Kundan Dangler Earrings.JPG",
    "3_double_hoop_earrings.jpg": "3.Double hoop earrings for a single piercing.JPG",
    "4_gold_hoop_1.jpg": "4.Gold Hoop-1.JPG",
    "4_gold_hoop_2.jpg": "4.Gold Hoop-2.JPG",
    "5_gold_plated_pair_earrings.jpg": "5.Gold plated pair earrings combo set.JPG",
    "6_studs_1.jpg": "6.Studs-1.JPG",
    "6_studs_2.jpg": "6.Studs-2.JPG",
    "6_studs_3.jpg": "6.Studs-3.JPG",
    "6_studs_4.jpg": "6.Studs-4.JPG",
    "6_studs_5.jpg": "6.Studs-5.JPG",
    "7_huggie_earrings_1.jpg": "7.Huggie earrings with pearl and ball drops-1.JPG",
    "7_huggie_earrings_2.jpg": "7.Huggie earrings with pearl and ball drops-2.JPG",
    "8_hoop_stud_earrings_combo.jpg": "8.Hoop and stud earrings multipack combo set.JPG",
}

print("=" * 60)
print("📱 Google Drive Earrings Image Downloader")
print("=" * 60)

# Try to download the folder
try:
    print(f"\n📁 Downloading folder: {folder_id}")
    print(f"📂 Destination: {images_dir}")
    
    # Download the entire folder
    output_dir = str(images_dir / "earrings_temp")
    gdown.download_folder(
        url=f"https://drive.google.com/drive/folders/{folder_id}",
        output=output_dir,
        quiet=False,
        use_cookies=False
    )
    
    print("\n✅ Download completed!")
    print("\nFiles downloaded:")
    for file in os.listdir(output_dir):
        print(f"  ✓ {file}")
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print("\n💡 Alternative: Please download manually from:")
    print(f"   {f'https://drive.google.com/drive/folders/{folder_id}'}")
    print("\n   Then place the images in: src/assets/images/")
    print("\n📋 Expected filenames:")
    for local_name in earring_files.keys():
        print(f"   • {local_name}")

print("\n" + "=" * 60)
