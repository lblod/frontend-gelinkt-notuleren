import { RdfaParser } from 'rdfa-streaming-parser';
import factory from '@rdfjs/dataset';

export default function htmlToRdf(html) {
  return new Promise((res, rej) => {
    const myParser = new RdfaParser({ contentType: 'text/html' });
    const dataset = factory.dataset();
    myParser
      .on('data', (data) => {
        dataset.add(data);
      })
      .on('error', rej)
      .on('end', () => res(dataset));
    myParser.write(html);
    myParser.end();
  });
}
