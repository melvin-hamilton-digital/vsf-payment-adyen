// This function will be fired both on server and client side context after registering other parts of the module
export function afterRegistration({ Vue, store, isServer }){
    let correctPaymentMethod = false
    const placeOrder = function () {
        if (correctPaymentMethod) {
            Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
                encrypted_card_number: store.state.adyen.encrypted_card_number,
                encrypted_expiry_month: store.state.adyen.encrypted_expiry_month,
                encrypted_expiry_year: store.state.adyen.encrypted_expiry_year,
                encrypted_security_code: store.state.adyen.encrypted_security_code
            })
        }
    }
    if (!isServer) {
        Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)
        console.info('This will be called after extension registration and only on client side')

        Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
            let methods = store.state['payment-backend-methods'].methods
            if (methods !== null && methods.find(item => item.code === paymentMethodCode)) {
                correctPaymentMethod = true
            } else {
                correctPaymentMethod = false
            }
        })
    }
}
