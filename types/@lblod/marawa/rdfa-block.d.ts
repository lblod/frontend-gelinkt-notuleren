import type Triple from './triple';
import type RichNode from './rich-node';
type Region = [number, number];
export default class RdfaBlock {
  constructor(content: unknown);

  get region(): Region;
  set region(region: Region);

  get length(): number;
  get richNode(): RichNode;

  get context(): Triple[];

  isInRegion(region: Region): boolean;
  isPartiallyInRegion(region: Region): boolean;
  isPartiallyOrFullyInRegion(region: Region): boolean;
  containsRegion(region: Region): boolean;
  normalizeRegion(region: Region): Region;
}
