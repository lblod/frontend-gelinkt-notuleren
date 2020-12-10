import Store from "ember-data/store";

/** @typedef {import("@ember-data/model").default} Model */

/** @extends {Store} */
export default class ExtendedStoreService extends Store {
  /**
   * TODO: test and refine. It works, but expect bugs
   * TODO: consider adopting ember-data-storefront, which might make this obsolete
   * Returns a query which fetches an entire path of nested relationships.
   * This means that once resolved, you will have an array of records
   * of the first component of the path, with the relationships defined by the
   * rest of the path already resolved. It avoids unnecessary queries when the
   * first relationship is empty.
   *
   * It is especially useful when the modelInstance is not yet persisted,
   * since in that case you can't rely on a simple query of the root model with includes.
   *
   * relationShipPath follows the syntax of the "include" option of the query method.
   *
   * example:
   *
   * const post = this.store.findRecord("post", id);
   *
   * const comments = await this.store.queryNestedRelationship(post, "comments.author");
   *
   * comments.forEach(comment => console.log(comment.author.name)) -> author is resolved here
   *
   * this tries to provide a solution for the dreaded dance of awaiting relationships:
   *
   * const post = this.store.findRecord("post", id);
   * const comments = await post.comments;
   * const authors = await Promise.all(comments.map(c=>c.author);
   *
   *
   * @method
   * @param {Model} modelInstance
   * @param {string} relationShipPath
   * */
  async queryNestedRelationship(modelInstance, relationShipPath) {
    const [firstRelationship, ...restInclude] =relationShipPath.split(".");
    const firstRelInfo = modelInstance.constructor.relationshipsByName.get(
      firstRelationship
    );
    const isMany = firstRelInfo.kind === "hasMany";

    const empty = await modelInstance[firstRelationship];
    if (isMany) {
      const result = empty.length
        ? this.query(firstRelInfo.type, {
            "filter[:id:]": empty.map((rel) => rel.id).join(","),
            include: restInclude,
          })
        : [];
      return result;
    } else {
      const result = empty
        ? this.query(firstRelInfo.type, {
            "filter[:id:]": empty.id,
            include: restInclude,
          })
        : [];
      return result;
    }
  }
}
