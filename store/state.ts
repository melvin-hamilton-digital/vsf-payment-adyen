import { AdyenState } from '../types/AdyenState'

export const state: AdyenState = {
  isAdyenValid: false,
  adyenCard: {},
  paymentMethods: [],
  saveCard: false,
  loadedCards: [],
  publicHash: null
}
