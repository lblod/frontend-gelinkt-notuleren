import { RdfaParser } from 'rdfa-streaming-parser';
import factory from '@rdfjs/dataset';
import type { Quad, DatasetCore } from '@rdfjs/types';

export default function htmlToRdf(html: string): Promise<DatasetCore<Quad>> {
  return new Promise((res, rej) => {
    const myParser = new RdfaParser({ contentType: 'text/html' });
    const dataset = factory.dataset();
    myParser
      .on('data', (data: Quad) => {
        dataset.add(data);
      })
      .on('error', rej)
      .on('end', () => res(dataset));
    myParser.write(html);
    myParser.end();
  });
}
