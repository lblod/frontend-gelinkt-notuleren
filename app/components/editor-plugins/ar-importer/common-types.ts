import type { PNode } from '@lblod/ember-rdfa-editor';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type { ArticleInsertPosition } from 'frontend-gelinkt-notuleren/utils/article-insert-position';

export type ArticlePosition = { node: PNode; pos: number };

export type InsertPositionOption = {
  label: string;
  value: ArticleInsertPosition;
};

export type ArInsertFunc = (
  arDesign: ArDesign,
  insertPosition: ArticleInsertPosition,
  skipWarnings?: boolean,
) => void;
