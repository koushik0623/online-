import os
from PIL import Image, ImageDraw

os.makedirs('public/images', exist_ok=True)

# 6 Canvas Product Images
canvas_items = [
    ('couple.png', 'COUPLE PORTRAIT', '#FCE4EC', '#D4AF7F'),
    ('Krishna.png', 'LORD KRISHNA', '#FFF9F5', '#C89B3C'),
    ('Radhakrishna.png', 'RADHA KRISHNA', '#FCE4EC', '#C89B3C'),
    ('Rohit.png', 'ROHIT NAME ART', '#F5F5F5', '#2C2C2C'),
    ('Shiva.jpg', 'LORD SHIVA', '#E3F2FD', '#1565C0'),
    ('Swan.jpg', 'SWAN ART', '#FFF9F5', '#D4AF7F')
]

for filename, title, bg_color, border_color in canvas_items:
    img = Image.new('RGB', (600, 600), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Outer frame border (4x4 inch style)
    draw.rectangle([20, 20, 580, 580], outline=border_color, width=12)
    draw.rectangle([35, 35, 565, 565], outline='#2C2C2C', width=3)
    
    # Inner canvas background
    draw.rectangle([50, 50, 550, 550], fill='#FFFFFF', outline='#E0E0E0', width=2)
    
    # Header badge
    draw.rectangle([140, 70, 460, 120], fill=border_color)
    draw.text((300, 95), 'CANVAS FRAME 4x4 INCH', fill='#FFFFFF', anchor='mm')
    
    # Center text & art representation
    draw.text((300, 270), title, fill='#2C2C2C', anchor='mm')
    draw.text((300, 340), 'Custom Canvas Frame (4x4 Inch)', fill='#757575', anchor='mm')
    draw.text((300, 430), 'RS. 199/-', fill=border_color, anchor='mm')
    
    save_path = os.path.join('public', 'images', filename)
    img.save(save_path)
    print('Generated Canvas Image:', save_path)

# 3 Flower Product Images
flower_items = [
    ('crimson_blossom.jpg', 'CRIMSON BLOSSOM BOUQUET', '#FFEEEF', '#D32F2F'),
    ('golden_bloom.jpg', 'GOLDEN BLOOM BOUQUET', '#FFFDE7', '#F57F17'),
    ('pink_blossom.jpg', 'PINK BLOSSOM BOUQUET', '#FCE4EC', '#C2185B')
]

for filename, title, bg_color, border_color in flower_items:
    img = Image.new('RGB', (600, 600), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([20, 20, 580, 580], outline=border_color, width=10)
    draw.rectangle([40, 40, 560, 560], fill='#FFFFFF', outline='#E0E0E0', width=2)
    
    # Header badge
    draw.rectangle([140, 70, 460, 120], fill=border_color)
    draw.text((300, 95), 'BOTANICAL FLOWER BOUQUET', fill='#FFFFFF', anchor='mm')
    
    draw.text((300, 270), title, fill='#2C2C2C', anchor='mm')
    draw.text((300, 340), 'Handcrafted Luxury Bouquet', fill='#757575', anchor='mm')
    draw.text((300, 430), 'RS. 399/-', fill=border_color, anchor='mm')
    
    save_path = os.path.join('public', 'images', filename)
    img.save(save_path)
    print('Generated Flower Image:', save_path)
