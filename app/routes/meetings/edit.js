import Route from "@ember/routing/route";

export default class MeetingsEditRoute extends Route {
  async model(params) {
    const zitting = await this.store.findRecord("zitting", params.id, {
      include:
        "bestuursorgaan,secretaris,voorzitter",
    });
    return zitting;
  }
}
