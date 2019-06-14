<template>
  <div class="paypal-block">
    <p>Note, you will be redirect to PayPal page.</p>
  </div>
</template>
<script>
import store from '@vue-storefront/core/store'

export default {
  name: 'PayPal',
  data () {
    return {
      payment: this.$store.state.checkout.paymentDetails
    }
  },
  mounted () {
    store.dispatch('adyen/adyenValid')
  },
  beforeDestroy () {
    store.dispatch('adyen/adyenInvalid')
  }
}
</script>
