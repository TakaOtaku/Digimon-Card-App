import time

# Check for performance dependencies
try:
    import lxml
    print("✅ lxml parser available - faster HTML parsing enabled")
except ImportError:
    print("⚠️  lxml not found - install with 'pip install lxml' for better performance")

import TransformPNG
import MoveFiles
import DeletePNGs
import FormatCards
import GetCardData
import GetCardImages
import GetLinks
import PrepareCards

import WikiVariables
import WikiFunctions

print("🃏 Starting Digimon Card Wiki Data Extraction")
print("=" * 60)
total_start_time = time.time()

# GetLinks.py -----------------------------------------------------
# Get all the Links to all Cards from the Main Sets and Promo Cards
print('🔗 Fetching card links from wiki pages...')

import time
start_time = time.time()

for wikiPageLink in WikiVariables.wikiPageLinks:
    print(f'Getting Links for: {wikiPageLink["name"]}')
    GetLinks.getLinks(wikiPageLink)

print('Getting Promo Links')
GetLinks.getPromoLinks()

print('Comparing to saved Links')
GetLinks.saveLinks()

# Sort Links and set how many Cards are there
WikiVariables.cardLinks = sorted(list(set(WikiVariables.cardLinks)))
WikiVariables.cardCount = len(WikiVariables.cardLinks)

link_time = time.time() - start_time
print(f'✅ Link fetching completed in {link_time:.1f}s - Found {WikiVariables.cardCount} cards')
# ----------------------------------------------------------------

# GetCardData.py -------------------------------------------------
# Get the relevant Card Data from the Wiki (with performance improvements)
print(f'\n📊 Processing {WikiVariables.cardCount} cards...')
card_start_time = time.time()

# Try to use the fast parallel version, fall back to standard if needed
try:
    from GetCardDataFast import getCardDataOptimized
    print('🚀 Using fast parallel processing...')
    getCardDataOptimized("normal")  # Use normal mode (5 workers, balanced)
    print(f'✅ Fast processing completed! Processed {len(WikiVariables.cards)} cards')
except ImportError:
    print('⚡ Using optimized standard method...')
    GetCardData.getCardData()  # This now includes session reuse improvements
    print(f'✅ Standard processing completed! Processed {len(WikiVariables.cards)} cards')
except Exception as e:
    print(f'❌ Fast processing failed: {e}')
    print('⚡ Falling back to standard method...')
    GetCardData.getCardData()
    print(f'✅ Fallback processing completed! Processed {len(WikiVariables.cards)} cards')

card_time = time.time() - card_start_time
card_rate = len(WikiVariables.cards) / card_time if card_time > 0 and WikiVariables.cards else 0
print(f'📈 Card extraction: {card_time:.1f}s ({card_rate:.2f} cards/sec)')

print('Getting Card Rulings!')
WikiFunctions.getRulings()

print('Saving Cards!')
WikiFunctions.saveCards()
# ----------------------------------------------------------------

# GetCardImages.py -----------------------------------------------
# Fetching Card Images and setting correct IDs and Notes
print('\n🖼️  Fetching card images and alternative arts...')
image_start_time = time.time()

print('Fetching AAs and Images!')
GetCardImages.getCardImages()

print('Setting correct Notes!')
WikiFunctions.setNotes()

print('Saving Cards!')
WikiFunctions.saveCards()

image_time = time.time() - image_start_time
print(f'✅ Image processing completed in {image_time:.1f}s')
# ----------------------------------------------------------------

# FormatCards.py && TransformPNG.py && PrepareCards.py -----------
# Formatting the Cards and preparing them for DigimonCard.app
print('\n🔧 Formatting and preparing card data...')
format_start_time = time.time()

print('Formatting DigimonCard JSON!')
FormatCards.replaceStrings()

print('Removing Keyword Explanations!')
for replacement in WikiVariables.replacements:
  FormatCards.replace_string_in_json(replacement, '')

print('Removing Spaces!')
FormatCards.replace_string_in_json('    ', ' ')
FormatCards.replace_string_in_json('   ', ' ')
FormatCards.replace_string_in_json('   ', ' ')
FormatCards.replace_string_in_json('  ', ' ')
FormatCards.replace_string_in_json(' .', '.')

print('Removing Samples!')
FormatCards.removeSamples()

print('Convert PNG to WebP!')
TransformPNG.pngToWebP()

print('PrepareCards!')
PrepareCards.prepareCards()

format_time = time.time() - format_start_time
print(f'✅ Formatting completed in {format_time:.1f}s')
# ----------------------------------------------------------------

# MoveFiles.py && DeletePNG.py -----------------------------------
# Move the Files to the correct place and cleanup
print('\n🧹 Final cleanup and file organization...')
cleanup_start_time = time.time()

print('Images to correct folders!')
MoveFiles.moveFiles()

print('Delete PNGs!')
DeletePNGs.deletePNGs()

cleanup_time = time.time() - cleanup_start_time
print(f'✅ Cleanup completed in {cleanup_time:.1f}s')
# ----------------------------------------------------------------

total_time = time.time() - total_start_time
print(f'\n🎉 All processing completed successfully!')
print("=" * 60)
print(f"📊 Final Statistics:")
print(f"  🔗 Cards processed: {len(WikiVariables.cards) if WikiVariables.cards else 0}")
print(f"  ⏱️  Total time: {total_time:.1f}s ({total_time/60:.1f} minutes)")
print(f"  🚀 Average speed: {len(WikiVariables.cards)/total_time:.2f} cards/sec" if WikiVariables.cards and total_time > 0 else "")
print("=" * 60)
print('✅ Done!')
