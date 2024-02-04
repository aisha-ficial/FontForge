import sys
import os.path
import logging
from argparse import ArgumentParser

from fontTools import ttLib
from fontTools import merge
from merge_noto import add_gsub_to_font, has_gsub_table
from nototools.substitute_linemetrics import read_line_metrics, set_line_metrics
from fontTools.misc.loggingTools import Timer

log = logging.getLogger("nototools.merge_fonts")


# directory that contains the files to be merged
directory = ""


# file names to be merged
files = [
    # It's recommended to put NotoSans-Regular.ttf as the first element in the
    # list to maximize the amount of meta data retained in the final merged font.
    "NotoSans-Regular.ttf",
    "NotoSansAdlam-Regular.ttf",
    "NotoSansAdlamUnjoined-Regular.ttf",
    "NotoSansAnatolianHieroglyphs-Regular.ttf",
    "NotoSansArabic-Regular.ttf",
    "NotoSansArabicUI-Regular.ttf",
    "NotoSansArmenian-Regular.ttf",
    "NotoSansAvestan-Regular.ttf",
    "NotoSansBalinese-Regular.ttf",
    "NotoSansBamum-Regular.ttf",
    "NotoSansBatak-Regular.ttf",
    "NotoSansBengali-Regular.ttf",
    "NotoSansBengaliUI-Regular.ttf",
    "NotoSansBrahmi-Regular.ttf",
    "NotoSansBuginese-Regular.ttf",
    "NotoSansBuhid-Regular.ttf",
    "NotoSansCJKjp-Regular.otf",
    "NotoSansCJKkr-Regular.otf",
    "NotoSansCJKsc-Regular.otf",
    "NotoSansCJKtc-Regular.otf",
    "NotoSansCanadianAboriginal-Regular.ttf",
    "NotoSansCarian-Regular.ttf",
    "NotoSansChakma-Regular.ttf",
    "NotoSansCham-Regular.ttf",
    "NotoSansCherokee-Regular.ttf",
    "NotoSansCoptic-Regular.ttf",
    "NotoSansCuneiform-Regular.ttf",
    "NotoSansCypriot-Regular.ttf",
    "NotoSansDeseret-Regular.ttf",
    "NotoSansDevanagari-Regular.ttf",
    "NotoSansDevanagariUI-Regular.ttf",
    "NotoSansDisplay-Regular.ttf",
    "NotoSansEgyptianHieroglyphs-Regular.ttf",
    "NotoSansEthiopic-Regular.ttf",
    "NotoSansGeorgian-Regular.ttf",
    "NotoSansGlagolitic-Regular.ttf",
    "NotoSansGothic-Regular.ttf",
    "NotoSansGujarati-Regular.ttf",
    "NotoSansGujaratiUI-Regular.ttf",
    "NotoSansGurmukhi-Regular.ttf",
    "NotoSansGurmukhiUI-Regular.ttf",
    "NotoSansHanunoo-Regular.ttf",
    "NotoSansHebrew-Regular.ttf",
    "NotoSansImperialAramaic-Regular.ttf",
    "NotoSansInscriptionalPahlavi-Regular.ttf",
    "NotoSansInscriptionalParthian-Regular.ttf",
    "NotoSansJavanese-Regular.ttf",
    "NotoSansKaithi-Regular.ttf",
    "NotoSansKannada-Regular.ttf",
    "NotoSansKannadaUI-Regular.ttf",
    "NotoSansKayahLi-Regular.ttf",
    "NotoSansKharoshthi-Regular.ttf",
    "NotoSansKhmer-Regular.ttf",
    "NotoSansKhmerUI-Regular.ttf",
    "NotoSansLao-Regular.ttf",
    "NotoSansLaoUI-Regular.ttf",
    "NotoSansLepcha-Regular.ttf",
    "NotoSansLimbu-Regular.ttf",
    "NotoSansLinearB-Regular.ttf",
    "NotoSansLisu-Regular.ttf",
    "NotoSansLycian-Regular.ttf",
    "NotoSansLydian-Regular.ttf",
    "NotoSansMalayalam-Regular.ttf",
    "NotoSansMalayalamUI-Regular.ttf",
    "NotoSansMandaic-Regular.ttf",
    "NotoSansMeeteiMayek-Regular.ttf",
    "NotoSansMongolian-Regular.ttf",
    "NotoSansMono-Regular.ttf",
    "NotoSansMonoCJKjp-Regular.otf",
    "NotoSansMonoCJKkr-Regular.otf",
    "NotoSansMonoCJKsc-Regular.otf",
    "NotoSansMonoCJKtc-Regular.otf",
    "NotoSansMyanmar-Regular.ttf",
    "NotoSansMyanmarUI-Regular.ttf",
    "NotoSansNKo-Regular.ttf",
    "NotoSansNewTaiLue-Regular.ttf",
    "NotoSansOgham-Regular.ttf",
    "NotoSansOlChiki-Regular.ttf",
    "NotoSansOldItalic-Regular.ttf",
    "NotoSansOldPersian-Regular.ttf",
    "NotoSansOldSouthArabian-Regular.ttf",
    "NotoSansOldTurkic-Regular.ttf",
    "NotoSansOriya-Regular.ttf",
    "NotoSansOriyaUI-Regular.ttf",
    "NotoSansOsage-Regular.ttf",
    "NotoSansOsmanya-Regular.ttf",
    "NotoSansPhagsPa-Regular.ttf",
    "NotoSansPhoenician-Regular.ttf",
    "NotoSansRejang-Regular.ttf",
    "NotoSansRunic-Regular.ttf",
    "NotoSansSamaritan-Regular.ttf",
    "NotoSansSaurashtra-Regular.ttf",
    "NotoSansShavian-Regular.ttf",
    "NotoSansSinhala-Regular.ttf",
    "NotoSansSinhalaUI-Regular.ttf",
    "NotoSansSundanese-Regular.ttf",
    "NotoSansSylotiNagri-Regular.ttf",
    "NotoSansSymbols-Regular.ttf",
    "NotoSansSymbols2-Regular.ttf",
    "NotoSansSyriacEastern-Regular.ttf",
    "NotoSansSyriacEstrangela-Regular.ttf",
    "NotoSansSyriacWestern-Regular.ttf",
    "NotoSansTagalog-Regular.ttf",
    "NotoSansTagbanwa-Regular.ttf",
    "NotoSansTaiLe-Regular.ttf",
    "NotoSansTaiTham-Regular.ttf",
    "NotoSansTaiViet-Regular.ttf",
    "NotoSansTamil-Regular.ttf",
    "NotoSansTamilUI-Regular.ttf",
    "NotoSansTelugu-Regular.ttf",
    "NotoSansTeluguUI-Regular.ttf",
    "NotoSansThaana-Regular.ttf",
    "NotoSansThai-Regular.ttf",
    "NotoSansThaiUI-Regular.ttf",
    "NotoSansTibetan-Regular.ttf",
    "NotoSansTifinagh-Regular.ttf",
    "NotoSansUgaritic-Regular.ttf",
    "NotoSansVai-Regular.ttf",
    "NotoSansYi-Regular.ttf",
]


def build_valid_filenames(files=files, directory=directory):
    files = list(files)
    directory = directory.rstrip("/")
    if directory == "" or directory is None:
        directory = "."
    valid_files = []
    for f in files:
        valid_file = directory + "/" + f
        if not os.path.isfile(valid_file):
            log.warning("can not find %s, skipping it." % valid_file)
        else:
            valid_files.append(valid_file)

    if len(valid_files) == 0:
        return valid_files
    if os.path.basename(valid_files[0]) != files[0]:
        log.warning(
            "can not find the font %s to read line metrics from. Line "
            + "metrics in the result might be wrong." % files[0]
        )
    return valid_files


def main():
    t = Timer()
    parser = ArgumentParser()
    parser.add_argument(
        "-d", "--directory", default="./", help="Path to directory containing the fonts"
    )
    parser.add_argument(
        "-o", "--output", default="merged.ttf", help="Path to output file."
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Verbose mode, printing out more info",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO if args.verbose else logging.WARNING)

    valid_files = build_valid_filenames(directory=args.directory)
    if len(valid_files) <= 1:
        log.warning(
            "expecting at least two fonts to merge, but only got %d " + "font(s).",
            len(valid_files),
        )
        sys.exit(-1)

    for idx, file in enumerate(valid_files):
        if not has_gsub_table(file):
            log.info("adding default GSUB table to %s." % file)
            valid_files[idx] = add_gsub_to_font(file)

    merger = merge.Merger()
    print("Merging %d Fonts..." % len(valid_files))
    font = merger.merge(valid_files)
    # Use the line metric in the first font to replace the one in final result.
    metrics = read_line_metrics(ttLib.TTFont(valid_files[0]))
    set_line_metrics(font, metrics)
    font.save(args.output)
    font.close()

    print(
        "%d fonts are merged. %d fonts are skipped. Cost %0.3f s."
        % (len(valid_files), len(files) - len(valid_files), t.time())
    )
    print(
        "Please check the result at %s."
        % os.path.abspath(os.path.realpath(args.output))
    )


if __name__ == "__main__":
    main()














