import { AdyenState } from '../types/AdyenState';
import rootStore from '@vue-storefront/core/store'
import { ActionTree } from 'vuex';
import * as types from './mutation-types';
import Vue from 'vue';
// import axios from 'axios'
import { Logger } from '@vue-storefront/core/lib/logger'
import fetch from 'isomorphic-fetch'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import SideRequest from '@vue-storefront/core/lib/side-request';

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<AdyenState, any> = {
  // if you are using cache in your module it's a good practice to allow develoeprs to choose either to use it or not
  saveCardData ({ commit }, { cardData }) {
    return new Promise ((resolve, reject) => {
        commit(types.ADD_CARD_DATA, cardData)
        resolve(cardData)
    })
  },
  removeCardData ({ commit }) {
    return new Promise ( (resolve, reject) => {
      commit(types.REMOVE_CARD_DATA)
    })
  },
  adyenValid ({ commit }) {
    return new Promise ( (resolve, reject) => {
      commit(types.VALID)
    })
  },
  adyenInvalid ({ commit }) {
    return new Promise ( (resolve, reject) => {
      commit(types.INVALID)
    })
  },
  set (context, { code, value, description }) {
    const adyenCollection = Vue.prototype.$db.adyenCollection
    adyenCollection.setItem(code, {
      code: code,
      created_at: new Date(),
      value: value,
      description: description
    }).catch((reason) => {
      Logger.error(reason) // it doesn't work on SSR
    })
  },

  async loadPaymentMethods ({ commit, rootGetters }, { cartId, country }) {
    const baseUrl = `${SideRequest(config.api, 'url')}ext/payment-adyen/`

    try {
      const { storeCode } = currentStoreView()
      let token = ''
      if (rootGetters['user/getUserToken']) {
        token = `?token=${rootGetters['user/getUserToken']}`
      }
      
      let response = await fetch(`${baseUrl}methods/${storeCode}/${cartId}${token}`, {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: {
            countryId: country
          }
        })
      })
      let { result } = await response.json()
      commit(types.SET_PAYMENT_METHODS, result ? result : [])
    } catch (err) {
      console.error('[Adyen Payments]', err)
    }
  },

  async initPayment ({ commit, rootGetters, rootState }, { method, additional_data, browserInfo, storePaymentMethod = {} }) {
    const cartId = rootGetters['cart/getCartToken']
    if (!cartId) {
      console.error('[Adyen] CartId does not exist')
      return
    }
    let token = ''
    if (rootGetters['user/getUserToken']) {
      token = `?token=${rootGetters['user/getUserToken']}`
    }

    let customer_id = null
    if (rootState.user.current && rootState.user.current.id) {
      customer_id = rootState.user.current.id
    }

    const baseUrl = `${SideRequest(config.api, 'url')}ext/payment-adyen/`

    try {
      const { storeCode } = currentStoreView()
      let response = await fetch(`${baseUrl}payment/start/${storeCode}/${cartId}${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method,
          ...(customer_id ? {customer_id} : {}),
          ...(storePaymentMethod ? {storePaymentMethod} : {}),
          additional_data: {
            number: additional_data.encryptedCardNumber,
            expiryMonth: additional_data.encryptedExpiryMonth,
            cvc: additional_data.encryptedSecurityCode,
            expiryYear: additional_data.encryptedExpiryYear,
            holderName: additional_data.holderName,
            ...browserInfo,
            allow3DS2: true,
            channel: 'web'
          }
        })
      })

      let { result } = await response.json()

      return result
      
    } catch (err) {
      console.error('[Adyen Payments]', err)
    }
  },

  async fingerprint3ds ({ commit, rootGetters, rootState }, { fingerprint, noPaymentData = false, challenge = false }) {
    const cartId = rootGetters['cart/getCartToken']
    if (!cartId) {
      console.error('[Adyen] CartId does not exist')
      return
    }
    let token = ''
    if (rootGetters['user/getUserToken']) {
      token = `?token=${rootGetters['user/getUserToken']}`
    }

    let customer_id = null
    if (rootState.user.current && rootState.user.current.id) {
      customer_id = rootState.user.current.id
    }

    const baseUrl = `${SideRequest(config.api, 'url')}ext/payment-adyen/`

    try {
      const { storeCode } = currentStoreView()
      let response = await fetch(`${baseUrl}payment/fingerprint/${storeCode}/${cartId}${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fingerprint,
          ...(customer_id ? {customer_id} : {}),
          ...(noPaymentData ? {noPaymentData} : {}),
          ...(challenge ? {challenge} : {})
        })
      })

      let { result } = await response.json()

      return result
      
    } catch (err) {
      console.error('[Adyen Payments]', err)
    }
  }
}
