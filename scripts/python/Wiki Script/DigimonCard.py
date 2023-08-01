from Restriction import Restriction
from Name import Name


class DigimonCard:
    def __init__(self):
        self._id = "-"
        self._name = Name()
        self._cardImage = ""
        self._cardType = "-"
        self._dp = "-"
        self._playCost = "-"
        self._digivolveCondition = []
        self._cardLv = "-"
        self._form = "-"
        self._attribute = "-"
        self._type = "-"
        self._rarity = "-"
        self._cardNumber = "-"

        self._digiXros = "-"
        self._specialDigivolve = "-"
        self._burstDigivolve = "-"
        self._dnaDigivolve = "-"

        self._effect = "-"
        self._digivolveEffect = "-"
        self._securityEffect = "-"
        self._aceEffect = '-'
        self._notes = '-'
        self._color = '-'
        self._version = "Normal"
        self._illustrator = "-"
        self._block = []
        self._restrictions = Restriction()
        self._AAs = []
        self._JAAs = []

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        self._id = value

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    @property
    def cardImage(self):
        return self._cardImage

    @cardImage.setter
    def cardImage(self, value):
        self._cardImage = value

    @property
    def cardType(self):
        return self._cardType

    @cardType.setter
    def cardType(self, value):
        self._cardType = value

    @property
    def dp(self):
        return self._dp

    @dp.setter
    def dp(self, value):
        self._dp = value

    @property
    def playCost(self):
        return self._playCost

    @playCost.setter
    def playCost(self, value):
        self._playCost = value

    @property
    def digivolveCondition(self):
        return self._digivolveCondition

    @digivolveCondition.setter
    def digivolveCondition(self, value):
        self._digivolveCondition = value

    @property
    def cardLv(self):
        return self._cardLv

    @cardLv.setter
    def cardLv(self, value):
        self._cardLv = value

    @property
    def form(self):
        return self._form

    @form.setter
    def form(self, value):
        self._form = value

    @property
    def attribute(self):
        return self._attribute

    @attribute.setter
    def attribute(self, value):
        self._attribute = value

    @property
    def type(self):
        return self._type

    @type.setter
    def type(self, value):
        self._type = value

    @property
    def rarity(self):
        return self._rarity

    @rarity.setter
    def rarity(self, value):
        self._rarity = value

    @property
    def cardNumber(self):
        return self._cardNumber

    @cardNumber.setter
    def cardNumber(self, value):
        self._cardNumber = value

    @property
    def digiXros(self):
        return self._digiXros

    @digiXros.setter
    def digiXros(self, value):
        self._digiXros = value

    @property
    def specialDigivolve(self):
        return self._specialDigivolve

    @specialDigivolve.setter
    def specialDigivolve(self, value):
        self._specialDigivolve = value

    @property
    def dnaDigivolve(self):
        return self._dnaDigivolve

    @dnaDigivolve.setter
    def dnaDigivolve(self, value):
        self._dnaDigivolve = value

    @property
    def burstDigivolve(self):
        return self._burstDigivolve

    @burstDigivolve.setter
    def burstDigivolve(self, value):
        self._burstDigivolve = value

    @property
    def effect(self):
        return self._effect

    @effect.setter
    def effect(self, value):
        self._effect = value

    @property
    def digivolveEffect(self):
        return self._digivolveEffect

    @digivolveEffect.setter
    def digivolveEffect(self, value):
        self._digivolveEffect = value

    @property
    def securityEffect(self):
        return self._securityEffect

    @securityEffect.setter
    def securityEffect(self, value):
        self._securityEffect = value

    @property
    def aceEffect(self):
        return self._aceEffect

    @aceEffect.setter
    def aceEffect(self, value):
        self._aceEffect = value

    @property
    def notes(self):
        return self._notes

    @notes.setter
    def notes(self, value):
        self._notes = value

    @property
    def color(self):
        return self._color

    @color.setter
    def color(self, value):
        self._color = value

    @property
    def version(self):
        return self._version

    @version.setter
    def version(self, value):
        self._version = value

    @property
    def illustrator(self):
        return self._illustrator

    @illustrator.setter
    def illustrator(self, value):
        self._illustrator = value

    @property
    def block(self):
        return self._block

    @block.setter
    def block(self, value):
        self._block = value

    @property
    def restrictions(self):
        return self._restrictions

    @restrictions.setter
    def restrictions(self, value):
        self._restrictions = value

    @property
    def AAs(self):
        return self._AAs

    @AAs.setter
    def AAs(self, value):
        self._AAs = value

    @property
    def JAAs(self):
        return self._JAAs

    @JAAs.setter
    def JAAs(self, value):
        self._JAAs = value
