import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

// see https://emberjs.com/api/ember/3.7/classes/PromiseProxyMixin for
// info on how this is used.

export default class PromiseProxyObject extends ObjectProxy.extend(PromiseProxyMixin) {}
