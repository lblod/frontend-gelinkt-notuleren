export const rangordeStringMapping = {
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
  ACHTIENDE: 18,
  NEGENTIENDE: 19,
  TWINTIGSTE: 20,
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
