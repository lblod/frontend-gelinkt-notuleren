import { v4 as uuid } from 'uuid';

const urisToRegenerate = [
  'http://data.lblod.info/titles/',
  'http://data.lblod.info/chapters/',
  'http://data.lblod.info/sections/',
  'http://data.lblod.info/subsections/',
  'http://data.lblod.info/artikels/',
  'http://data.lblod.info/paragraphs/',
];

export function replaceUris(content) {
  let contentProcessing = content;
  const alreadyReplaced = {};
  for (const uri of urisToRegenerate) {
    const regex = new RegExp(`"${uri}[^"]*"`);
    contentProcessing = contentProcessing.replace(regex, (match) => {
      if (alreadyReplaced[match]) {
        return alreadyReplaced[match];
      } else {
        const newUuid = uuid();
        const newUri = `${uri}${newUuid}`;
        alreadyReplaced[match] = newUri;
        return newUri;
      }
    });
  }
  const contentProcessed = contentProcessing;
  return contentProcessed;
}
