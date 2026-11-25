import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import FormatCards
import WikiVariables


class FormatCardsTests(unittest.TestCase):
    def test_requested_line_breaks_survive_following_pipeline_replacements(self):
        examples = {
            "burst": ("5 [Burst Digivolve]", "5\n[Burst Digivolve]"),
            "dna": ("5 [DNA Digivolve]", "5\n[DNA Digivolve]"),
            "quote": ('."[On Play]', '."\n[On Play]'),
            "period": (".{Trash}", ".\n{Trash}"),
            "angle": ("＞ {Hand}", "＞\n{Hand}"),
            "unchanged": ("No formatting needed.", "No formatting needed."),
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "cards.json"
            path.write_text(json.dumps([{"_id": "test", "effects": {key: value[0] for key, value in examples.items()}, "AAs": [], "JAAs": []}]), encoding="utf-8")

            def open_fixture(_path, mode):
                return path.open(mode, encoding="utf-8")

            with patch.object(FormatCards, "open", open_fixture, create=True):
                FormatCards.replaceStrings()
                for replacement in WikiVariables.replacements:
                    FormatCards.replace_string_in_json(replacement, "")
                for search in ("    ", "   ", "   ", "  ", " ."):
                    FormatCards.replace_string_in_json(search, "." if search == " ." else " ")
                FormatCards.removeSamples()

            result = json.loads(path.read_text(encoding="utf-8"))[0]["effects"]
            self.assertEqual(result, {key: value[1] for key, value in examples.items()})

    def test_line_break_rules_skip_nested_token_descriptions_only(self):
        examples = {
            "token": ("(Digimon/Red/＜Decoy (Black)＞ ＜Rush＞.[On Play] 5 [DNA Digivolve].{Hand} ＞ {Trash})",
                      "(Digimon/Red/＜Decoy (Black)＞ ＜Rush＞.[On Play] 5 [DNA Digivolve].{Hand} ＞ {Trash})"),
            "outside": ("(other.[On Play]).{Hand} ＞ {Trash}", "(other.\n[On Play]).\n{Hand} ＞\n{Trash}"),
            "after_token": ("(Digimon/Red/＜Rush＞) [On Play]", "(Digimon/Red/＜Rush＞)\n[On Play]"),
            "existing_break": ("(Digimon/Red/first\nsecond)", "(Digimon/Red/first\nsecond)"),
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "cards.json"
            path.write_text(json.dumps([{"_id": "test", "effects": {key: value[0] for key, value in examples.items()}}]), encoding="utf-8")
            def open_fixture(_path, mode):
                return path.open(mode, encoding="utf-8")
            with patch.object(FormatCards, "open", open_fixture, create=True):
                FormatCards.replaceStrings()
            result = json.loads(path.read_text(encoding="utf-8"))[0]["effects"]
            self.assertEqual(result, {key: value[1] for key, value in examples.items()})


if __name__ == "__main__":
    unittest.main()
