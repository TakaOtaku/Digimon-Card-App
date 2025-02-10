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

# GetLinks.py -----------------------------------------------------
# Get all the Links to all Cards from the Main Sets and Promo Cards
for wikiPageLink in WikiVariables.wikiPageLinks:
    print('Getting Links for: ' + wikiPageLink['name'])
    GetLinks.getLinks(wikiPageLink)

print('Getting Promo Links')
GetLinks.getPromoLinks()

print('Comparing to saved Links')
GetLinks.saveLinks()

###GetLinks.addLinks()
###WikiFunctions.loadCards()

# Sort Links and set how many Cards are there
WikiVariables.cardLinks = sorted(list(set(WikiVariables.cardLinks)))
WikiVariables.cardCount = len(WikiVariables.cardLinks)
# ----------------------------------------------------------------

# GetCardData.py -------------------------------------------------
# Get the relevant Card Data from the Wiki
print('Getting Card Data!')
GetCardData.getCardData()

WF.getRulings()

print('Saving Cards!')
WikiFunctions.saveCards()
# ----------------------------------------------------------------

# GetCardImages.py -----------------------------------------------
# Fetching Card Images and setting correct IDs and Notes
print('Fetching AAs and Images!')
GetCardImages.getCardImages()

print('Setting correct Notes!')
WikiFunctions.setNotes()

print('Saving Cards!')
WikiFunctions.saveCards()
# ----------------------------------------------------------------

# FormatCards.py && TransformPNG.py && PrepareCards.py -----------
# Formatting the Cards and preparing them for DigimonCard.app
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
# ----------------------------------------------------------------

# MoveFiles.py && DeletePNG.py -----------------------------------
# Move the Files to the correct place and cleanup
print('Images to correct folders!')
MoveFiles.moveFiles()

print('Delete PNGs!')
DeletePNGs.deletePNGs()
# ----------------------------------------------------------------

print('Done!')
