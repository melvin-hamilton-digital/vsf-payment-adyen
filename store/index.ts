import { Module } from 'vuex'
import { AdyenState } from '../types/AdyenState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'

export const module: Module<AdyenState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
