class Restriction:
    def __init__(self):
        self._english = '-'
        self._japanese = '-'
        self._chinese = '-'
        self._korean = '-'

    @property
    def english(self):
        return self._english

    @english.setter
    def english(self, value):
        self._english = value

    @property
    def japanese(self):
        return self._japanese

    @japanese.setter
    def japanese(self, value):
        self._japanese = value

    @property
    def chinese(self):
        return self._chinese

    @chinese.setter
    def chinese(self, value):
        self._chinese = value

    @property
    def korean(self):
        return self._korean

    @korean.setter
    def korean(self, value):
        self._korean = value
