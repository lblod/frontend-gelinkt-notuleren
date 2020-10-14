import Route from "@ember/routing/route";

export default class MeetingsPublishRoute extends Route {
  async model(params) {
    const zitting = await this.store.findRecord("zitting", params.id, {
      include: "aanwezigen-bij-start,agendapunten,secretaris,voorzitter",
    });
    zitting.agendapunten = (await zitting.agendapunten).sortBy("position");
    return zitting;
  }
}
