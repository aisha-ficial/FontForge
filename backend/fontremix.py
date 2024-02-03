from fontTools.ttLib import TTFont

def merge_fonts(font1_path, font2_path, output_path):
    # Load fonts
    font1 = TTFont(font1_path)
    font2 = TTFont(font2_path)

    # Ensure both fonts have the 'glyf' table
    if 'glyf' not in font1 or 'glyf' not in font2:
        raise ValueError("Both fonts must have the 'glyf' table.")

    # Merge 'glyf' table
    font1['glyf'].glyphs.update(font2['glyf'].glyphs)

    # Update 'hmtx' table with metrics from font2
    for glyph_name, width in font2['hmtx'].metrics.items():
        font1['hmtx'].metrics[glyph_name] = width

    # Ensure 'glyf' table and 'glyphOrder' are consistent
    font1['glyf'].glyphOrder = sorted(font1['glyf'].glyphs.keys())

    # Save the merged font to a new TTF file
    font1.save(output_path)

# Example usage
font1_path = 'font1.ttf'
font2_path = 'font2.ttf'
output_path = 'merged_font.ttf'

merge_fonts(font1_path, font2_path, output_path)
