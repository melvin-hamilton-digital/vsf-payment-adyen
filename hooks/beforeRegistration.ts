import * as localForage from 'localforage'
import UniversalStorage from '@vue-storefront/core/lib/store/storage'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export function beforeRegistration ({ Vue, config, store, isServer }) {
  const storeView = currentStoreView()
  const dbNamePrefix = storeView.storeCode ? storeView.storeCode + '-' : ''

  StorageManager.set('adyenCollection', new UniversalStorage(localForage.createInstance({
    name: (config.cart.multisiteCommonCart ? '' : dbNamePrefix) + 'shop',
    storeName: 'adyen',
    driver: localForage[config.localForage.defaultDrivers['adyen']]
  })))


}


