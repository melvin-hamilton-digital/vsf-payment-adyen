import { createModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { module } from './store'
import { afterRegistration } from './hooks/afterRegistration'

export const KEY = 'adyen'

const moduleConfig: VueStorefrontModuleConfig = {
    key: KEY,
    store: { modules: [{ key: KEY, module }] },
    afterRegistration
}

export const Adyen = createModule(moduleConfig)
