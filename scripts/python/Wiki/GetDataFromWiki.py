import WikiVariables as WV
import WikiFunctions as WF
import PNGtoWebP as PW
import MoveFiles as MF
import DeletePNGs as DP
import PrepareCards as PC

# Get all Links to all Cards
for wikiPageLink in WV.wikiPageLinks:
    print('Getting Links for: ' + wikiPageLink['name'])
    WF.getLinks(wikiPageLink)
print('Getting Promo Links')
WF.getPromoLinks()

print('Comparing to saved Links')
WF.saveLinks()

WV.cardLinks = sorted(list(set(WV.cardLinks)))
WV.cardCount = len(WV.cardLinks)

print('Getting Card Data!')
WF.getCardData()

# WF.getRulings()

print('Saving Cards!')
WF.saveCards()

print('Fetching AAs and Images!')
WF.getCardImages()

print('Setting correct Notes!')
WF.setNotes()

print('Saving Cards!')
WF.saveCards()

print('Formatting DigimonCard JSON!')
WF.replaceStrings()

print('Removing Keyword Explanations!')
for replacement in WV.replacements:
    WF.replace_string_in_json(replacement, '')

print('Removing Spaces!')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json(' .', '.')

print('Removing Samples!')
WF.removeSamples()

print('Convert PNG to WebP!')
PW.pngToWebP()

print('PrepareCards!')
PC.prepareCards()

print('Images to correct folders!')
MF.moveFiles()

print('Delete PNGs!')
DP.deletePNGs()

print('Done!')
