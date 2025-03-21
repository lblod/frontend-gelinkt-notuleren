const rangordeStringMapping = {
  EERSTE: 1,
  TWEEDE: 2,
  DERDE: 3,
  VIERDE: 4,
  VIJFDE: 5,
  ZESDE: 6,
  ZEVENDE: 7,
  ACHTSTE: 8,
  NEGENDE: 9,
  TIENDE: 10,
  ELFDE: 11,
  TWAALFDE: 12,
  DERTIENDE: 13,
  VEERTIENDE: 14,
  VIJFTIENDE: 15,
  ZESTIENDE: 16,
  ZEVENTIENDE: 17,
  ACHTTIENDE: 18,
  NEGENTIENDE: 19,
  TWINTIGSTE: 20,
  EENENTWINTIGSTE: 21,
  TWEEËNTWINTIGSTE: 22,
  DRIEËNTWINTIGSTE: 23,
  VIERENTWINTIGSTE: 24,
  VIJFENTWINTIGSTE: 25,
  ZESENTWINTIGSTE: 26,
  ZEVENENTWINTIGSTE: 27,
  ACHTENTWINTIGSTE: 28,
  NEGENENTWINTIGSTE: 29,
  DERTIGSTE: 30,
  EENENDERTIGSTE: 31,
  TWEEËNDERTIGSTE: 32,
  DRIEËNDERTIGSTE: 33,
  VIERENDERTIGSTE: 34,
  VIJFENDERTIGSTE: 35,
  ZESENDERTIGSTE: 36,
  ZEVENENDERTIGSTE: 37,
  ACHTENDERTIGSTE: 38,
  NEGENENDERTIGSTE: 39,
  VEERTIGSTE: 40,
  EENENVEERTIGSTE: 41,
  TWEEËNVEERTIGSTE: 42,
  DRIEËNVEERTIGSTE: 43,
  VIERENVEERTIGSTE: 44,
  VIJFENVEERTIGSTE: 45,
  ZESENVEERTIGSTE: 46,
  ZEVENENVEERTIGSTE: 47,
  ACHTENVEERTIGSTE: 48,
  NEGENENVEERTIGSTE: 49,
  VIJFTIGSTE: 50,
  EENENVIJFTIGSTE: 51,
  TWEEËNVIJFTIGSTE: 52,
  DRIEËNVIJFTIGSTE: 53,
  VIERENVIJFTIGSTE: 54,
  VIJFENVIJFTIGSTE: 55,
  ZESENVIJFTIGSTE: 56,
  ZEVENENVIJFTIGSTE: 57,
  ACHTENVIJFTIGSTE: 58,
  NEGENENVIJFTIGSTE: 59,
  ZESTIGSTE: 60,
  EENENZESTIGSTE: 61,
  TWEEËNZESTIGSTE: 62,
  DRIEËNZESTIGSTE: 63,
  VIERENZESTIGSTE: 64,
  VIJFENZESTIGSTE: 65,
  ZESENZESTIGSTE: 66,
  ZEVENENZESTIGSTE: 67,
  ACHTENZESTIGSTE: 68,
  NEGENENZESTIGSTE: 69,
  ZEVENTIGSTE: 70,
  EENENZEVENTIGSTE: 71,
  TWEEËNZEVENTIGSTE: 72,
  DRIEËNZEVENTIGSTE: 73,
  VIERENZEVENTIGSTE: 74,
  VIJFENZEVENTIGSTE: 75,
  ZESENZEVENTIGSTE: 76,
  ZEVENENZEVENTIGSTE: 77,
  ACHTENZEVENTIGSTE: 78,
  NEGENENZEVENTIGSTE: 79,
  TACHTIGSTE: 80,
  EENENTACHTIGSTE: 81,
  TWEEËNTACHTIGSTE: 82,
  DRIEËNTACHTIGSTE: 83,
  VIERENTACHTIGSTE: 84,
  VIJFENTACHTIGSTE: 85,
  ZESENTACHTIGSTE: 86,
  ZEVENENTACHTIGSTE: 87,
  ACHTENTACHTIGSTE: 88,
  NEGENENTACHTIGSTE: 89,
  NEGENTIGSTE: 90,
  EENENNEGENTIGSTE: 91,
  TWEEËNNEGENTIGSTE: 92,
  DRIEËNNEGENTIGSTE: 93,
  VIERENNEGENTIGSTE: 94,
  VIJFENNEGENTIGSTE: 95,
  ZESENNEGENTIGSTE: 96,
  ZEVENENNEGENTIGSTE: 97,
  ACHTENNEGENTIGSTE: 98,
  NEGENENNEGENTIGSTE: 99,
  HONDERDSTE: 100,
  HONDERDEERSTE: 101,
  HONDERDTWEEDE: 102,
  HONDERDDERDE: 103,
  HONDERDVIERDE: 104,
  HONDERDVIJFDE: 105,
  HONDERDZESDE: 106,
  HONDERDZEVENDE: 107,
  HONDERDACHTSTE: 108,
  HONDERDNEGEND: 109,
  HONDERDTIENDE: 110,
  HONDERDELFDE: 111,
  HONDERDTWAALFDE: 112,
  HONDERDDERTIENDE: 113,
  HONDERDVEERTIENDE: 114,
  HONDERDVIJFTIENDE: 115,
  HONDERDZESTIENDE: 116,
  HONDERDZEVENTIENDE: 117,
  HONDERDACHTTIENDE: 118,
  HONDERDNEGENTIENDE: 119,
  HONDERDTWINTIGSTE: 120,
  HONDERDEENENTWINTIGSTE: 121,
  HONDERDTWEEËNTWINTIGSTE: 122,
  HONDERDDRIEËNTWINTIGSTE: 123,
  HONDERDVIERENTWINTIGSTE: 124,
  HONDERDVIJFENTWINTIGSTE: 125,
  HONDERDZESENTWINTIGSTE: 126,
  HONDERDZEVENENTWINTIGSTE: 127,
  HONDERDACHTENTWINTIGSTE: 128,
  HONDERDNEGENENTWINTIGSTE: 129,
  HONDERDDERTIGSTE: 130,
  HONDERDEENENDERTIGSTE: 131,
  HONDERDTWEEËNDERTIGSTE: 132,
  HONDERDDRIEËNDERTIGSTE: 133,
  HONDERDVIERENDERTIGSTE: 134,
  HONDERDVIJFENDERTIGSTE: 135,
  HONDERDZESENDERTIGSTE: 136,
  HONDERDZEVENENDERTIGSTE: 137,
  HONDERDACHTENDERTIGSTE: 138,
  HONDERDNEGENENDERTIGSTE: 139,
  HONDERDVEERTIGSTE: 140,
  HONDERDEENENVEERTIGSTE: 141,
  HONDERDTWEEËNVEERTIGSTE: 142,
  HONDERDDRIEËNVEERTIGSTE: 143,
  HONDERDVIERENVEERTIGSTE: 144,
  HONDERDVIJFENVEERTIGSTE: 145,
  HONDERDZESENVEERTIGSTE: 146,
  HONDERDZEVENENVEERTIGSTE: 147,
  HONDERDACHTENVEERTIGSTE: 148,
  HONDERDNEGENENVEERTIGSTE: 149,
  HONDERDVIJFTIGSTE: 150,
  HONDERDEENENVIJFTIGSTE: 151,
  HONDERDTWEEËNVIJFTIGSTE: 152,
  HONDERDDRIEËNVIJFTIGSTE: 153,
  HONDERDVIERENVIJFTIGSTE: 154,
  HONDERDVIJFENVIJFTIGSTE: 155,
  HONDERDZESENVIJFTIGSTE: 156,
  HONDERDZEVENENVIJFTIGSTE: 157,
  HONDERDACHTENVIJFTIGSTE: 158,
  HONDERDNEGENENVIJFTIGSTE: 159,
  HONDERDZESTIGSTE: 160,
  HONDERDEENENZESTIGSTE: 161,
  HONDERDTWEEËNZESTIGSTE: 162,
  HONDERDDRIEËNZESTIGSTE: 163,
  HONDERDVIERENZESTIGSTE: 164,
  HONDERDVIJFENZESTIGSTE: 165,
  HONDERDZESENZESTIGSTE: 166,
  HONDERDZEVENENZESTIGSTE: 167,
  HONDERDACHTENZESTIGSTE: 168,
  HONDERDNEGENENZESTIGSTE: 169,
  HONDERDZEVENTIGSTE: 170,
  HONDERDEENENZEVENTIGSTE: 171,
  HONDERDTWEEËNZEVENTIGSTE: 172,
  HONDERDDRIEËNZEVENTIGSTE: 173,
  HONDERDVIERENZEVENTIGSTE: 174,
  HONDERDVIJFENZEVENTIGSTE: 175,
  HONDERDZESENZEVENTIGSTE: 176,
  HONDERDZEVENENZEVENTIGSTE: 177,
  HONDERDACHTENZEVENTIGSTE: 178,
  HONDERDNEGENENZEVENTIGSTE: 179,
  HONDERDTACHTIGSTE: 180,
  HONDERDEENENTACHTIGSTE: 181,
  HONDERDTWEEËNTACHTIGSTE: 182,
  HONDERDDRIEËNTACHTIGSTE: 183,
  HONDERDVIERENTACHTIGSTE: 184,
  HONDERDVIJFENTACHTIGSTE: 185,
  HONDERDZESENTACHTIGSTE: 186,
  HONDERDZEVENENTACHTIGSTE: 187,
  HONDERDACHTENTACHTIGSTE: 188,
  HONDERDNEGENENTACHTIGSTE: 189,
  HONDERDNEGENTIGSTE: 190,
  HONDERDEENENNEGENTIGSTE: 191,
  HONDERDTWEEËNNEGENTIGSTE: 192,
  HONDERDDRIEËNNEGENTIGSTE: 193,
  HONDERDVIERENNEGENTIGSTE: 194,
  HONDERDVIJFENNEGENTIGSTE: 195,
  HONDERDZESENNEGENTIGSTE: 196,
  HONDERDZEVENENNEGENTIGSTE: 197,
  HONDERDACHTENNEGENTIGSTE: 198,
  HONDERDNEGENENNEGENTIGSTE: 199,
  TWEEHONDERDSTE: 200,
};

/**
 *
 * @param {string | undefined} rangordeString
 * @returns {number | null}
 */
export const rangordeStringToNumber = (rangordeString) => {
  if (!rangordeString) {
    return null;
  }
  const firstWord = rangordeString.split(' ')[0];
  return rangordeStringMapping[firstWord.toUpperCase()];
};
