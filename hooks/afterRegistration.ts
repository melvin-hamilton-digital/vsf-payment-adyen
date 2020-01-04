export function afterRegistration({ Vue, store, isServer }) {
    let correctPaymentMethod = false
    const placeOrder = function () {
        if (correctPaymentMethod) {
            Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
                encrypted_card_number: store.state.adyen.adyenCard.encrypted_card_number,
                encrypted_expiry_month: store.state.adyen.adyenCard.encrypted_expiry_month,
                encrypted_expiry_year: store.state.adyen.adyenCard.encrypted_expiry_year,
                encrypted_security_code: store.state.adyen.adyenCard.encrypted_security_code
            })
        }
    }
    if (!isServer) {
        Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)

        Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
            let methods = store.state['payment-backend-methods'].methods
            if (methods !== null && methods.find(item => item.code === paymentMethodCode)) {
                correctPaymentMethod = true
            } else {
                correctPaymentMethod = false
            }
        })

        Vue.prototype.$bus.$on('checkout-after-created', () => {
            store.dispatch('payment-adyen/setPublicHash', null)
            store.dispatch('payment-adyen/setSaveCard', [])
        })

        Vue.prototype.$bus.$on('user-after-logout', () => {
            store.dispatch('payment-adyen/setPublicHash', null)
            store.dispatch('payment-adyen/setSaveCard', [])
        })
    }
}
