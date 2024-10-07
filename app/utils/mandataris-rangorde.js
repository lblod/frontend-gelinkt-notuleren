export const rangordeStringMapping = {
  Eerste: 1,
  Tweede: 2,
  Derde: 3,
  Vierde: 4,
  Vijfde: 5,
  Zesde: 6,
  Zevende: 7,
  Achtste: 8,
  Negende: 9,
  Tiende: 10,
  Elfde: 11,
  Twaalfde: 12,
  Dertiende: 13,
  Veertiende: 14,
  Vijftiende: 15,
  Zestiende: 16,
  Zeventiende: 17,
  Achtiende: 18,
  Negentiende: 19,
  Twintigste: 20,
};

export const rangordeStringToNumber = (rangordeString) => {
  if (!rangordeString) {
    return null;
  }
  const firstWord = rangordeString.split(' ')[0];
  return rangordeStringMapping[firstWord];
};
