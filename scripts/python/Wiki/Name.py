class Name:
    def __init__(self):
        self._english = '-'
        self._japanese = '-'
        self._traditionalChinese = '-'
        self._simplifiedChinese = '-'
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
    def traditionalChinese(self):
        return self._traditionalChinese
    @traditionalChinese.setter
    def traditionalChinese(self, value):
        self._traditionalChinese = value

    @property
    def simplifiedChinese(self):
        return self._simplifiedChinese
    @simplifiedChinese.setter
    def simplifiedChinese(self, value):
        self._simplifiedChinese = value

    @property
    def korean(self):
        return self._korean
    @korean.setter
    def korean(self, value):
        self._korean = value
