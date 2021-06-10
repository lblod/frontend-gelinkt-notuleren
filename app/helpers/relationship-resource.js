import { Resource } from 'ember-could-get-used-to-this';
import { restartableTask } from 'ember-concurrency';

/**
 * @callback DependencySetup
 * @return {[Model, string]}
 */
/**
 * @typedef {Object} RelationshipResourceValue
 * @property {*} value the value of the resolved relationship path
 * @property {boolean} isRunning true when the underlying task is running, false otherwise
 * @property {boolean} isIdle the opposite of isRunning
 * @property {number} performCount the number of times the underlying task has been performed
 */

/**
 * Resource to encapsulate the usecase where we just want to await a relationship
 * of a model, but also update when that model changes.
 *
 * We expose a subset of the underlying task for convenience, and also provide a reference
 * to the task as an escape hatch.
 *
 * The underlying task is restartable, to avoid unnecessary requests.
 *
 * It essentially is an ember-concurrency task to await the relationship, but which automatically
 * retriggers when the parent model changes
 *
 * Cancels all running tasks on teardown.
 *
 * Usage:
 *
 * @use data = new RelationshipResource(() => [this.args.model, 'relationship.path.otherRelationship.etc']
 */
export default class RelationshipResource extends Resource {
  /**
   * @param {DependencySetup} setup
   */
  // this constructor is mainly here to keep linters and typecheckers happy, it is
  // very funky otherwise
  // eslint-disable-next-line no-unused-vars
  constructor(setup) {
    super(...arguments);
  }

  /**
   * The value that the property which you decorated with @use will take on
   * @return {RelationshipResourceValue}
   */
  get value() {
    const {
      isRunning,
      isIdle,
      performCount,
      last: { value },
    } = this.resolveTask;
    return {
      value,
      isRunning,
      isIdle,
      performCount,
      task: this.resolveTask,
    };
  }

  setup() {
    this.update();
  }

  update() {
    this.resolveTask.perform();
  }

  teardown() {
    this.resolveTask.cancelAll();
  }

  @restartableTask
  *resolveTask() {
    const [model, relationshipPath] = this.args.positional;
    return yield model.get(relationshipPath);
  }
}
