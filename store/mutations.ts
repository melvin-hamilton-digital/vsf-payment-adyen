import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.ADD_CARD_DATA] (state, payload) {
    state.adyenCard = payload
    state.isAdyenValid = true
  },
  [types.REMOVE_CARD_DATA] (state) {
    state.adyenCard = {}
    state.isAdyenValid = false
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
        "holderName": "John Smith",
        id: card.gateway_token,
        lastFour: maskedCC,
        name: "VISA",
        supportedShopperInteractions: [
          "Ecommerce",
          "ContAuth"
        ],
        type: "scheme"
      }
    })
  }
}
