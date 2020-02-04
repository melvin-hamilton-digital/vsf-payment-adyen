import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import Vue from 'vue'

export const mutations: MutationTree<any> = {
  [types.ADD_CARD_DATA] (state, payload) {
    Vue.set(state, 'adyenCard', payload)
  },
  [types.REMOVE_CARD_DATA] (state) {
    Vue.set(state, 'adyenCard', {})
  },
  [types.VALID] (state) {
    state.isAdyenValid = true
  },
  [types.INVALID] (state) {
    state.isAdyenValid = false
  },
  [types.SET_PAYMENT_METHODS] (state, result) {
    state.paymentMethods = result
  },
  [types.SET_SAVE_CARD] (state, value) {
    state.saveCard = value
  },

  [types.SET_LOADED_CARDS] (state, value) {
    state.loadedCards = value.map(card => {
      const { type, maskedCC, expirationDate } = JSON.parse(card.token_details)
      const [ expiryMonth, expiryYear ] = expirationDate.split('/')

      return {
        brand: type,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        id: card.gateway_token,
        lastFour: maskedCC,
        name: "VISA",
        supportedShopperInteractions: [
          "Ecommerce",
          "ContAuth"
        ],
        holderName: 'You',
        public_hash: card.public_hash,
        type: "scheme"
      }
    })
  },

  [types.SET_PUBLIC_HASH] (state, value) {
    state.publicHash = value
  }

}
