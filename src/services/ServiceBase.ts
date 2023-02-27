import type ServicesBase from "./ServicesBase.js"

abstract class ServiceBase<TServicesBase extends ServicesBase> {
  #services: TServicesBase
  constructor(services: TServicesBase) {
    this.#services = services
  }
  get services(): TServicesBase {
    return this.#services
  }
}
export default ServiceBase
