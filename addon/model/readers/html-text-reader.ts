import Reader from '@lblod/ember-rdfa-editor/model/readers/reader';
import ModelText from '@lblod/ember-rdfa-editor/model/model-text';
import { HtmlReaderContext } from '@lblod/ember-rdfa-editor/model/readers/html-reader';

/**
 * Reader responsible for reading HTML Text nodes
 */
export default class HtmlTextReader
  implements Reader<Text, ModelText[], HtmlReaderContext>
{
  read(from: Text, context: HtmlReaderContext): ModelText[] {
    if (!from.textContent || from.textContent === '') {
      return [];
    }
    const result = new ModelText(from.textContent);
    context.activeMarks.forEach(({ spec, attributes }) =>
      result.addMark(spec, attributes)
    );
    context.bindNode(result, from);
    return [result];
  }
}
