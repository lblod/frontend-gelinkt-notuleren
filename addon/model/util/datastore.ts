import * as RDF from '@rdfjs/types';
import dataset, {FastDataset} from '@graphy/memory.dataset.fast';
import ModelRange, {RangeContextStrategy} from "@lblod/ember-rdfa-editor/model/model-range";
import ModelNode from "@lblod/ember-rdfa-editor/model/model-node";
import {NotImplementedError} from "@lblod/ember-rdfa-editor/utils/errors";
import {ModelQuadSubject, RdfaParser} from "@lblod/ember-rdfa-editor/utils/rdfa-parser/rdfa-parser";
import {RDF_TYPE} from "@lblod/ember-rdfa-editor/model/util/constants";

export default interface Datastore {
  get dataset(): RDF.Dataset;

  subjectsForRange(range: ModelRange, strategy: RangeContextStrategy): Set<RDF.Quad_Subject>;

  dataForRange(range: ModelRange, strategy: RangeContextStrategy): RDF.Dataset;
}

interface DatastoreConfig {
  root: ModelNode;
  pathFromDomRoot?: Node[];
}

export class EditorStore implements Datastore {

  private _dataset: RDF.Dataset;
  private _subjectToNodesMapping: Map<string, Set<ModelNode>>;
  private _nodeToSubjectMapping: Map<ModelNode, ModelQuadSubject>;

  constructor({root, pathFromDomRoot}: DatastoreConfig) {
    const parser = new RdfaParser({baseIRI: "http://example.org"});
    const {dataset, subjectToNodesMapping, nodeToSubjectMapping} = parser.parse(root, pathFromDomRoot);
    this._dataset = dataset;
    this._subjectToNodesMapping = subjectToNodesMapping;
    this._nodeToSubjectMapping = nodeToSubjectMapping;
  }

  get dataset(): RDF.Dataset {
    return this._dataset;
  }

  subjectsForRange(range: ModelRange, strategy: RangeContextStrategy): Set<RDF.Quad_Subject> {
    const subjects = new Set<RDF.Quad_Subject>();
    for (const node of range.contextNodes(strategy)) {
      const subject = this._nodeToSubjectMapping.get(node);
      if (subject) {
        subjects.add(subject);
      }
    }
    return subjects;

  }

  dataForRange(range: ModelRange, strategy: RangeContextStrategy): RDF.Dataset {
    const subjects = this.subjectsForRange(range, strategy);
    const result = new GraphyDataset();
    for (const subject of subjects) {
      result.addAll(this.dataset.match(subject));
    }
    return result;
  }

  nodesForSubject(subject: RDF.Quad_Subject): Set<ModelNode> | undefined {
    return this._subjectToNodesMapping.get(subject.value);
  }

  nodesForType(type: string, searchRange?: ModelRange, strategy: RangeContextStrategy = "rangeContains") {
    let dataset: RDF.Dataset;
    if (searchRange) {
      dataset = this.dataForRange(searchRange, strategy);
    } else {
      dataset = this.dataset;
    }
    const quads = [...dataset.match(
      undefined,
      {termType: "NamedNode", value: RDF_TYPE},
      {termType: "NamedNode", value: type}
    )];
    return quads.map(quad => ({subject: quad.subject, nodes: this.nodesForSubject(quad.subject)}));
  }

}

function isFastDataset(thing: unknown): thing is FastDataset {
  // ts fails us here, see https://github.com/Microsoft/TypeScript/issues/21732
  if (thing && "isGraphyFastDataset" in (thing as Record<string, unknown>)) {
    return (thing as FastDataset).isGraphyFastDataset;
  }
  return false;
}

function isGraphyDataset(thing: unknown): thing is GraphyDataset {
  return thing instanceof GraphyDataset;
}

type QuadDataSet = RDF.Dataset<RDF.Quad, RDF.Quad>;

/**
 * Spec-compliant wrapper for graphy
 */
export class GraphyDataset implements QuadDataSet {
  private _fastDataset: FastDataset;

  constructor(quads?: RDF.Dataset | RDF.Quad[] | FastDataset | GraphyDataset) {
    if (isFastDataset(quads)) {
      this._fastDataset = quads;
    } else if (isGraphyDataset(quads)) {
      this._fastDataset = quads.fastDataset;
    } else {
      this._fastDataset = dataset();
      if (quads) {
        this._fastDataset.addAll(quads);
      }
    }
  }

  get size(): number {
    return this.fastDataset.size;
  }

  get fastDataset(): FastDataset {
    return this._fastDataset;
  }

  add(quad: RDF.Quad): this {
    this.fastDataset.add(quad);
    return this;
  }

  delete(quad: RDF.Quad): this {
    this.fastDataset.delete(quad);
    return this;
  }

  has(quad: RDF.Quad): boolean {
    return this.fastDataset.has(quad);
  }

  match(subject?: RDF.Quad_Subject | null, predicate?: RDF.Quad_Predicate | null, object?: RDF.Quad_Object | null, graph?: RDF.Quad_Graph | null): QuadDataSet {
    return new GraphyDataset(this.fastDataset.match(subject, predicate, object, graph));
  }


  addAll(quads: QuadDataSet | RDF.Quad[]): this {
    this._fastDataset.addAll(quads);
    return this;
  }

  contains(other: QuadDataSet): boolean {
    return this.intersection(other).size === other.size;
  }

  deleteMatches(subject?: RDF.Quad_Subject, predicate?: RDF.Quad_Predicate, object?: RDF.Quad_Object, graph?: RDF.Quad_Graph): this {
    const matches = this.match(subject, predicate, object, graph);
    const quads: RDF.Quad[] = [...matches];
    this.fastDataset.deleteQuads(quads);
    return this;
  }

  difference(other: QuadDataSet): QuadDataSet {
    const gds = new GraphyDataset(other);
    return new GraphyDataset(this.fastDataset.difference(gds.fastDataset));
  }

  equals(other: RDF.Dataset<RDF.Quad, RDF.Quad>): boolean {
    const gds = new GraphyDataset(other);
    return this.fastDataset.equals(gds.fastDataset);
  }

  every(iteratee: (quad: RDF.Quad, dataset: RDF.Dataset<RDF.Quad, RDF.Quad>) => boolean): boolean {
    for (const quad of this) {
      if (!iteratee(quad, this)) {
        return false;
      }
    }
    return true;
  }

  filter(iteratee: (quad: RDF.Quad, dataset: RDF.Dataset<RDF.Quad, RDF.Quad>) => boolean): RDF.Dataset<RDF.Quad, RDF.Quad> {
    const rslt = [];
    for (const quad of this) {
      if (iteratee(quad, this)) {
        rslt.push(quad);
      }
    }
    return new GraphyDataset(rslt);
  }

  forEach(iteratee: (quad: RDF.Quad, dataset: RDF.Dataset<RDF.Quad, RDF.Quad>) => void): void {
    for (const quad of this) {
      iteratee(quad, this);
    }
  }

  import(stream: RDF.Stream<RDF.Quad>): Promise<this> {
    throw new NotImplementedError();
  }

  intersection(other: QuadDataSet): QuadDataSet {
    const gds = new GraphyDataset(other);
    return new GraphyDataset(this.fastDataset.intersection(gds.fastDataset));
  }

  map(iteratee: (quad: RDF.Quad, dataset: RDF.Dataset<RDF.Quad, RDF.Quad>) => RDF.Quad): RDF.Dataset<RDF.Quad, RDF.Quad> {
    const result = [];
    for (const quad of this) {
      result.push(iteratee(quad, this));
    }
    return new GraphyDataset(result);
  }

  reduce<A>(iteratee: (accumulator: A, quad: RDF.Quad, dataset: QuadDataSet) => A, initialValue?: A): A {
    const firstQuad = this[Symbol.iterator]().next().value as RDF.Quad | null;
    let accumulator = initialValue || firstQuad;
    // some bad typing in the spec causes these ugly casts
    for (const quad of this) {
      accumulator = iteratee(accumulator as A, quad, this);
    }

    return accumulator as A;

  }

  some(iteratee: (quad: RDF.Quad, dataset: RDF.Dataset<RDF.Quad, RDF.Quad>) => boolean): boolean {
    for (const quad of this) {
      if (iteratee(quad, this)) {
        return true;
      }
    }
    return false;
  }

  toArray(): RDF.Quad[] {
    return [...this];
  }

  toCanonical(): string {
    throw new NotImplementedError();
  }

  toStream(): RDF.Stream<RDF.Quad> {
    throw new NotImplementedError();
  }

  toString(): string {
    throw new NotImplementedError();
  }

  union(quads: RDF.Dataset<RDF.Quad, RDF.Quad>): RDF.Dataset<RDF.Quad, RDF.Quad> {
    const gds = new GraphyDataset(quads);
    return new GraphyDataset(this.fastDataset.union(gds.fastDataset));
  }

  [Symbol.iterator](): Iterator<RDF.Quad> {
    return this.fastDataset[Symbol.iterator]();
  }


}

