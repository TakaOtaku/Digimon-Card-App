import WikiVariables as WV
import WikiFunctions as WF

# Get all Links to all Cards
for wikiPageLink in WV.wikiPageLinks:
    print('Getting Links for: ' + wikiPageLink['name'])
    WF.getLinks(wikiPageLink)
print('Getting Promo Links')
WF.getPromoLinks()

WV.cardLinks = sorted(list(set(WV.cardLinks)))
WV.cardCount = len(WV.cardLinks)

WF.getCardData()

# WF.getRulings()

WF.setNotes()

WF.formatCards()

print('Formatting DigimonCard JSON!')
WF.replace_string_in_json('\n', '')
WF.replace_string_in_json(')[', ')\n[')
WF.replace_string_in_json(') [', ')\n[')
WF.replace_string_in_json(').[', ')\n[')
WF.replace_string_in_json(') .[', ')\n[')
WF.replace_string_in_json('.[', '.\n[')
WF.replace_string_in_json('. [', '.\n[')
WF.replace_string_in_json('＞＜', '＞\n＜')
WF.replace_string_in_json(')＜', ')\n＜')
WF.replace_string_in_json(') ＜', ')\n＜')
WF.replace_string_in_json('・', '\n・')
WF.replace_string_in_json(')＜', '\n・')
WF.replace_string_in_json(') ＜', '\n・')
WF.replace_string_in_json('.＜', '.\n＜')
WF.replace_string_in_json('＞.', '＞\n')
WF.replace_string_in_json('＞ ).', '')
WF.replace_string_in_json(' ).', '')

# WF.getCardImages()

print('Removing Keyword Explanations!')
for replacement in WV.replacements:
    WF.replace_string_in_json(replacement, '')

WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json('  ', '')
WF.replace_string_in_json(' .', '.')

print('Removing Samples!')
WF.removeSamples()

print('Done!')
