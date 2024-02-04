from PIL import Image, ImageDraw, ImageFont
import streamlit as st
import os
import tempfile
from fontTools import ttLib
from fontTools import merge
from merge_noto import add_gsub_to_font, has_gsub_table
from nototools.substitute_linemetrics import read_line_metrics, set_line_metrics

def create_font_preview(font_path, preview_text="ABCabc123"):
    image = Image.new("RGB", (300, 100), color="white")
    draw = ImageDraw.Draw(image)

    # Load font
    font_size = 30
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        return None

    # Draw text
    draw.text((10, 10), preview_text, font=font, fill="black")

    return image

def merge_fonts(font1, font2 , temp_font1 ,temp_font2):
    # Check if both fonts are uploaded
    if not font1 or not font2:
        st.error("Please upload both fonts.")
        return None

    # Check if both fonts have GSUB tables
    if not has_gsub_table(temp_font1) or not has_gsub_table(temp_font2):
        st.error("One or both of the selected fonts do not have GSUB tables.")
        return None

    # Merge fonts
    merger = merge.Merger()
    merged_font = merger.merge([temp_font1, temp_font2])

    # Use line metrics from the first font
    line_metrics = read_line_metrics(ttLib.TTFont(temp_font1))
    set_line_metrics(merged_font, line_metrics)

    # Save merged font to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".ttf") as temp_merged:
        merged_font.save(temp_merged.name)

    # Close fonts
    merged_font.close()

    return temp_merged.name

def main():
    st.title("Font Fusion") 
    st.markdown("[Upload to Fuse](http://localhost:8502)")
    st.markdown("[Home](https://font-forge.vercel.app)")
 
    
    
    # Pre-defined font options
    available_fonts = {
       "Noto Sans Arabic Regular": "NotoSansArabic-Regular.ttf",
        "Adlam Regular": "NotoSansAdlam-Regular.ttf",
        "Adlam Unjoined": "NotoSansAdlamUnjoined-Regular.ttf",
        "Noto Sans Regular": "NotoSans-Regular.ttf",
        "Arial": "NotoSansAdlam-Regular.ttf",
        "Helvetica": "NotoSansArabic-Regular.ttf",
        "Times New Roman": "NotoSansAdlamUnjoined-Regular.ttf",
        "Courier New": "NotoSansArabic-Regular.ttf",
        "Verdana": "NotoSansAdlam-Regular.ttf",
        "Georgia": "NotoSansAdlamUnjoined-Regular.ttf",
        "Tahoma": "NotoSansArabic-Regular.ttf",
        "Impact": "NotoSansAdlam-Regular.ttf",
        "Palatino": "NotoSans-Regular.ttf",
        "Garamond": "NotoSansArabic-Regular.ttf",
        "Book Antiqua": "NotoSansAdlam-Regular.ttf",
        "Trebuchet MS": "NotoSansAdlamUnjoined-Regular.ttf",
        "Lucida Console": "NotoSans-Regular.ttf",
        "Century Gothic": "NotoSansAdlamUnjoined-Regular.ttf",
        "Franklin Gothic Medium": "NotoSansArabic-Regular.ttf",
        "Baskerville": "NotoSansAdlam-Regular.ttf",
        "Futura": "NotoSans-Regular.ttf",
        "Copperplate": "NotoSansArabic-Regular.ttf",
        "Didot": "NotoSansAdlam-Regular.ttf",
        "Optima": "NotoSansAdlamUnjoined-Regular.ttf"
    }

    # Select the first font
    font1_option = st.selectbox("Select the first font", options=list(available_fonts.keys()))
    font1_path = os.path.join( available_fonts[font1_option])
    font1_preview = create_font_preview(font1_path)
    if font1_preview:
        st.subheader("Font 1 Preview")
        st.image(font1_preview, caption="Font 1 Preview", use_column_width=True)

    # Select the second font
    font2_option = st.selectbox("Select the second font", options=list(available_fonts.keys()))
    font2_path = os.path.join( available_fonts[font2_option])
    font2_preview = create_font_preview(font2_path)
    if font2_preview:
        st.subheader("Font 2 Preview")
        st.image(font2_preview, caption="Font 2 Preview", use_column_width=True)

    # Merge fonts
    if st.button("Merge Fonts"):
        merged_font_path = merge_fonts(font1_path, font2_path, font1_path, font2_path)
        if merged_font_path:
            st.success("Fonts merged successfully.")
            st.subheader("Merged Font Preview")
            merged_font_preview = create_font_preview(merged_font_path)
            if merged_font_preview:
                st.image(merged_font_preview, caption="Merged Font Preview", use_column_width=True)
            st.download_button(
                label="Download Merged Font",
                data=open(merged_font_path, "rb").read(),
                file_name="merged_font.ttf",
                mime="font/ttf"
            )

if __name__ == "__main__":
    main()
