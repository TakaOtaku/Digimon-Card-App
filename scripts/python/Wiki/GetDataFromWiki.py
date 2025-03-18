import TransformPNG
import MoveFiles
import FormatCards
import GetCardData
import GetCardImages
import GetLinks
import PrepareCards

import WikiVariables
import WikiFunctions

import asyncio
import aiohttp

async def main():
    # Create a single session for all HTTP requests
    connector = aiohttp.TCPConnector(limit=30, limit_per_host=10)
    timeout = aiohttp.ClientTimeout(total=60)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
    # GetLinks.py ----------------------------------------------------
        # Checking for new Main Set Links
        print('Checking for Main Set Links')
        await GetLinks.getMainSetLinks(session)

        # Checking for new Promo Links
        print('Checking for Promo Links')
        await GetLinks.getPromoLinks(session)

        # Loading already found Links
        GetLinks.loadLinks()

        # Sort Links and set how many Cards are there
        WikiVariables.cardLinks = sorted(list(set(WikiVariables.cardLinks)))
        WikiVariables.cardCount = len(WikiVariables.cardLinks)

        GetLinks.saveLinks()
        print('Card Links Saved')
    # ----------------------------------------------------------------

    # GetCardData.py -------------------------------------------------
        # Get the relevant Card Data from the Wiki
        print('Getting Card Data!')
        await GetCardData.getCardData(session)
    # ----------------------------------------------------------------

    # GetCardImages.py -----------------------------------------------
        #GetLinks.loadLinks()
        #WikiFunctions.loadCards()
        # Fetching Card Images and setting correct IDs and Notes
        print('Fetching AAs and Images!')
        await GetCardImages.getCardImages(session)

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

    print('Prepare Cards for DigimonCardApp!')
    PrepareCards.prepareCards()
# ----------------------------------------------------------------

# MoveFiles.py ---------------------------------------------------
    # Move the Files to the correct place and cleanup
    print('Jsons to correct folders!')
    MoveFiles.moveFiles()
# ----------------------------------------------------------------
    print('Done!')


if __name__ == "__main__":
    asyncio.run(main())
