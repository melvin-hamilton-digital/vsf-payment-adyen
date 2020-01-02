import { AdyenState } from '../types/AdyenState'
import { GetterTree } from 'vuex';

export const getters: GetterTree<AdyenState, any> = {

  methods (state) {
    return state.paymentMethods.map(payment => ({ type: payment.type, title: payment.title }))
  },

  saveCard: state => state.saveCard

}
