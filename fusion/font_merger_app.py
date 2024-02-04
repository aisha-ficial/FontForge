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

    # Save uploaded fonts to temporary files
   



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
def preview_font(font_file):
    if font_file is not None:
        # Load the font file
        font = ImageFont.truetype(font_file.name, size=50)
        
        # Create a blank image
        img = Image.new("RGB", (500, 100), color="white")
        draw = ImageDraw.Draw(img)

        # Draw some text using the loaded font
        draw.text((10, 10), "Preview Text", font=font, fill="black")

        # Display the image with the text drawn
        st.image(img, caption="Font Preview", use_column_width=True)

def main():
    st.title("Font Fusion")
   
   
    # Select the first font
    font1 = st.file_uploader("Select the first font file (.ttf or .otf)", type=["ttf", "otf"])
  
    if font1:
        st.subheader("Font 1 Preview")
        preview_font(font1)
        font1_preview = create_font_preview(font1.name)
        if font1_preview:
            st.image(font1_preview, caption="Font 1 Preview", use_column_width=True)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".ttf") as temp1:
            temp1.write(font1.read())
            temp_font1 = temp1.name

    # Select the second font
    font2 = st.file_uploader("Select the second font file (.ttf or .otf)", type=["ttf", "otf"])
   

    if font2:
        st.subheader("Font 2 Preview")
        font2_preview = create_font_preview(font2.name)
        if font2_preview:
            preview_font(font2)
            st.image(font2_preview, caption="Font 2 Preview", use_column_width=True)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".ttf") as temp2:
            temp2.write(font2.read())
            temp_font2 = temp2.name
    # Merge fonts
    if font1 and font2:
        if st.button("Merge Fonts"):
            merged_font_path = merge_fonts(font1, font2 ,temp_font1 ,temp_font2) 
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
