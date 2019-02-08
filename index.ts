import { module } from './store'
import { afterRegistration } from './hooks/afterRegistration'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'


export const KEY = 'adyen'

const moduleConfig: VueStorefrontModuleConfig = {
    key: KEY,
    store: { modules: [{ key: KEY, module }] },
    afterRegistration
}

export const Adyen = new VueStorefrontModule(moduleConfig)
