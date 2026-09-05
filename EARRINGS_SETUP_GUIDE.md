# 🎀 SPARKLE @KKV - EARRINGS IMAGE SETUP GUIDE

## 📱 Your Google Drive Folder
**Google Drive Link:** https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm

**Total Images:** 14 files organized into 8 products

---

## 📋 All Earring Images Inventory

### Product 1: Kundan Chandbali Earrings (SPK-ER-401)
- **File:** `1.Kundan chandbali Earings.JPG`
- **Local Name:** `1_kundan_chandbali_earrings.jpg`
- **Price:** ₹449 (Original: ₹649)
- **Stock:** 15 units

### Product 2: Kundan Dangler Earrings (SPK-ER-402)
- **File:** `2.Kundan Dangler Earrings.JPG`
- **Local Name:** `2_kundan_dangler_earrings.jpg`
- **Price:** ₹399 (Original: ₹599)
- **Stock:** 12 units

### Product 3: Double Hoop Earrings (SPK-ER-403)
- **File:** `3.Double hoop earrings for a single piercing.JPG`
- **Local Name:** `3_double_hoop_earrings.jpg`
- **Price:** ₹249 (Original: ₹379)
- **Stock:** 10 units

### Product 4: Gold Hoop Set (SPK-ER-404)
- **Files:** 
  - `4.Gold Hoop-1.JPG` → `4_gold_hoop_1.jpg`
  - `4.Gold Hoop-2.JPG` → `4_gold_hoop_2.jpg`
- **Price:** ₹299 (Original: ₹449)
- **Stock:** 14 units

### Product 5: Gold Plated Pair Combo (SPK-ER-405)
- **File:** `5.Gold plated pair earrings combo set.JPG`
- **Local Name:** `5_gold_plated_pair_earrings.jpg`
- **Price:** ₹249 (Original: ₹379)
- **Stock:** 11 units

### Product 6: Studs Multipack (SPK-ER-406)
- **Files:**
  - `6.Studs-1.JPG` → `6_studs_1.jpg`
  - `6.Studs-2.JPG` → `6_studs_2.jpg`
  - `6.Studs-3.JPG` → `6_studs_3.jpg`
  - `6.Studs-4.JPG` → `6_studs_4.jpg`
  - `6.Studs-5.JPG` → `6_studs_5.jpg`
- **Price:** ₹499 (Original: ₹749)
- **Stock:** 13 units

### Product 7: Huggie Earrings (SPK-ER-407)
- **Files:**
  - `7.Huggie earrings with pearl and ball drops-1.JPG` → `7_huggie_earrings_1.jpg`
  - `7.Huggie earrings with pearl and ball drops-2.JPG` → `7_huggie_earrings_2.jpg`
- **Price:** ₹229 (Original: ₹349)
- **Stock:** 9 units

### Product 8: Hoop & Stud Combo (SPK-ER-408)
- **File:** `8.Hoop and stud earrings multipack combo set.JPG`
- **Local Name:** `8_hoop_stud_earrings_combo.jpg`
- **Price:** ₹249 (Original: ₹379)
- **Stock:** 8 units

---

## 🚀 DOWNLOAD STEPS (3 METHODS)

### METHOD 1: Manual Download (Easiest)

1. **Open Google Drive Folder:**
   ```
   https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm
   ```

2. **Select All Files:**
   - Press `Ctrl + A` to select all 14 images

3. **Download as ZIP:**
   - Right-click → "Download" 
   - Or use Download button (↓) in toolbar

4. **Extract to Project:**
   - Extract ZIP to: `src/assets/images/`
   - The files will be automatically placed there

5. **Verify Files:**
   - Check `src/assets/images/` contains all 14 files
   - All should match the "Local Name" from above

6. **Build & Deploy:**
   ```bash
   npm run build
   ```

---

### METHOD 2: Using gdown (Automated - Command Line)

1. **Install gdown:**
   ```bash
   pip install gdown
   ```

2. **Download Entire Folder:**
   ```bash
   gdown --folder "https://drive.google.com/drive/folders/14AeNb3hi8ONF9jn_UcLtOC0Bvuh8onVm" -O src/assets/images/
   ```

3. **Rename Files (if needed):**
   ```bash
   # Run the rename script to normalize file names
   node scripts/rename-earrings.js
   ```

4. **Build:**
   ```bash
   npm run build
   ```

---

### METHOD 3: Individual File Download

Download each file manually from the folder:
1. Click each file
2. Click download icon
3. Save to `src/assets/images/`
4. Rename to match the "Local Name" pattern

---

## ✅ VERIFICATION CHECKLIST

After downloading, verify you have all these files in `src/assets/images/`:

- [ ] `1_kundan_chandbali_earrings.jpg`
- [ ] `2_kundan_dangler_earrings.jpg`
- [ ] `3_double_hoop_earrings.jpg`
- [ ] `4_gold_hoop_1.jpg`
- [ ] `4_gold_hoop_2.jpg`
- [ ] `5_gold_plated_pair_earrings.jpg`
- [ ] `6_studs_1.jpg`
- [ ] `6_studs_2.jpg`
- [ ] `6_studs_3.jpg`
- [ ] `6_studs_4.jpg`
- [ ] `6_studs_5.jpg`
- [ ] `7_huggie_earrings_1.jpg`
- [ ] `7_huggie_earrings_2.jpg`
- [ ] `8_hoop_stud_earrings_combo.jpg`

**Total: 14 files**

---

## 🔨 BUILD & DEPLOY

After files are in place:

```bash
# Navigate to project
cd "c:\Users\nani\Downloads\online shopping"

# Run build
npm run build

# Start dev server to preview
npm run dev
```

---

## 📝 MOCKDATA.JS STATUS

✅ **Updated!** All earring products in `src/data/mockData.js` are now configured to use your Google Drive images:

- **SPK-ER-401:** Kundan Chandbali (1 image)
- **SPK-ER-402:** Kundan Dangler (1 image)
- **SPK-ER-403:** Double Hoop (1 image)
- **SPK-ER-404:** Gold Hoop Set (2 images)
- **SPK-ER-405:** Gold Plated Pair (1 image)
- **SPK-ER-406:** Studs Multipack (5 images)
- **SPK-ER-407:** Huggie Earrings (2 images)
- **SPK-ER-408:** Hoop & Stud Combo (1 image)

All products have:
- ✅ Correct image paths
- ✅ Product descriptions
- ✅ Pricing information
- ✅ Stock levels
- ✅ Category assignments
- ✅ Rating & review counts

---

## 🆘 TROUBLESHOOTING

**Q: Build says images not found?**
A: Ensure images are in `src/assets/images/` and follow the exact filenames above.

**Q: Images not showing on website?**
A: Run `npm run build` again to include images in the distribution build.

**Q: File names don't match?**
A: Rename Google Drive files to match the "Local Name" pattern (lowercase, underscores instead of spaces).

**Q: Want to add more earring products?**
A: Add new product objects to `src/data/mockData.js` with matching image files.

---

## 📊 PROJECT STRUCTURE

```
src/
├── assets/
│   └── images/
│       ├── 1_kundan_chandbali_earrings.jpg
│       ├── 2_kundan_dangler_earrings.jpg
│       ├── 3_double_hoop_earrings.jpg
│       ├── 4_gold_hoop_1.jpg
│       ├── 4_gold_hoop_2.jpg
│       ├── 5_gold_plated_pair_earrings.jpg
│       ├── 6_studs_1.jpg
│       ├── 6_studs_2.jpg
│       ├── 6_studs_3.jpg
│       ├── 6_studs_4.jpg
│       ├── 6_studs_5.jpg
│       ├── 7_huggie_earrings_1.jpg
│       ├── 7_huggie_earrings_2.jpg
│       └── 8_hoop_stud_earrings_combo.jpg
├── data/
│   └── mockData.js (✅ Updated with correct image paths)
└── ...
```

---

## 🎯 NEXT STEPS

1. **Download all 14 images** from Google Drive folder
2. **Place in** `src/assets/images/`
3. **Run** `npm run build`
4. **Test on** `npm run dev`
5. **Deploy!** Your earring products are ready

---

**Happy selling! 🎉**

*Created: 2026-08-13*
*Sparkle @KKV Earrings Integration Complete*
