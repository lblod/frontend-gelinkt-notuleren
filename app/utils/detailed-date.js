/**
 * @param {Date} datetime
 * @returns string
 */
export const detailedDate = (datetime) => {
  //If not a date (e.g. date is undefined) return "" for printing on screen.
  if (!(datetime instanceof Date)) return '';

  try {
    /**
     * CLDR defines the date format as dd/MM/yyyy
     * @link https://github.com/unicode-org/cldr/blob/ed980db464b2eab4a74a98243c7f80d9e2d6695e/common/main/nl_BE.xml#L35
     *
     * Belgian institute of standardization, with NBN Z 01-002:2002 defines data display as either variant of
     *
     * * day d month yyyy ("maandag 9 september 2000"/"lundi 9 septembre 2000"/"Montag, den 9. September 2000")
     * * dd.mm.yyyy ("09.09.2000")
     * * yyyy-mm-dd ("2000-09-09")
     *
     * Someone has to go and submit an update to CLDR.
     *
     * Have jump through the hoops below.
     */
    const formattedDate = new Intl.DateTimeFormat('nl-BE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(datetime);

    const [datePart, timePart] = formattedDate.split(', ');
    // Replace the default separator (/) with - for the date part
    const formattedDateWithHyphen = datePart.replace(/\//g, '-');

    return `${formattedDateWithHyphen} ${timePart}`;
  } catch (e) {
    console.error(e);
    return '';
  }
};
