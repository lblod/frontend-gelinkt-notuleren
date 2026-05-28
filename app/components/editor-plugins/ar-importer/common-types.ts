import type { PNode } from '@lblod/ember-rdfa-editor';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';

export type ArticlePosition = { node: PNode; pos: number };

type InsertPosition = 'first' | 'last' | ArticlePosition;
export type InsertPositionOption = { label: string; value: InsertPosition };

export type ArInsertFunc = (
  arDesign: ArDesign,
  pos: ArticlePosition | null,
  skipWarnings?: boolean,
) => void;
