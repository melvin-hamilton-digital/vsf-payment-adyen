import { createModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { module } from './store'
import { afterRegistration } from './hooks/afterRegistration'
import { beforeRegistration } from './hooks/beforeRegistration'

export const KEY = 'payment-adyen'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] },
  beforeRegistration,
  afterRegistration
}

export const PaymentAdyen = createModule(moduleConfig)
