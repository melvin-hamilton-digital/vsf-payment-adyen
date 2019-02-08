import { AdyenState } from '../types/AdyenState';
import { ActionTree } from 'vuex';
import * as types from './mutation-types'

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
  }
}
