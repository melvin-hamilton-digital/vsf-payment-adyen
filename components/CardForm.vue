<template>
  <div class="adyen-block">
    <h3>Adyen {{ payment.paymentMethod }}</h3>
    <div class="cards-div">
      <div id="pmHolder" class="js-chckt-pm__pm-holder">
        <input type="hidden" name="txvariant" value="card">
        <label>
          <span class="input-field" data-cse="encryptedCardNumber" />
        </label>
        <label>
          <span class="input-field" data-cse="encryptedExpiryMonth" />
        </label>
        <label>
          <span class="input-field" data-cse="encryptedExpiryYear" />
        </label>
        <label>
          <span class="input-field" data-cse="encryptedSecurityCode" />
        </label>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  #pmHolder {
    iframe {
      height: 50px !important;
    }
  }
</style>
<script>
import {mapGetters} from 'vuex'
import store from '@vue-storefront/store'

export default {
  name: 'CardForm',
  data () {
    return {
      payment: this.$store.state.checkout.paymentDetails,
      csfSetupObj: {
        rootNode: '.cards-div',
        configObject: {
          originKey: this.$store.state.config.adyen.originKey
        },
        paymentMethods: {
          card: {
            sfStyles: {
              base: {
                height: '50px',
                color: 'black',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                fontFamily: 'Helvetica',
                padding: '5px',
                background: 'white',
                outline: '2px solid #E4E4E4'
              },
              error: {
                color: 'red',
                outline: '2px solid red'
              },
              validated: {
                color: 'green'
              }
            },
            placeholders: {
              encryptedCardNumber: '1111 2222 3333 4444',
              encryptedExpiryMonth: '12',
              encryptedExpiryYear: '22',
              encryptedSecurityCode: '123'
            }
          }
        }
      },
      securedData: {
        encrypted_card_number: '',
        encrypted_expiry_month: '',
        encrypted_expiry_year: '',
        encrypted_security_code: ''
      },
      securedFields: null
    }
  },
  computed: {
    ...mapGetters({
      paymentMethods: 'payment/paymentMethods'
    })
  },
  mounted () {
    if (!document.getElementById('adyen-secured-fields')) {
      if (typeof window !== 'undefined') {
        let promise = this.loadScript('https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSecuredFields.1.5.0.js')
        promise.then(
          () => {
            this.createForm()
          }
        ).catch(e => {
          console.info(e, 'e')
        })
      }
    } else {
      this.createForm()
    }
  },
  methods: {
    loadScript (src) {
      return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.setAttribute('id', 'adyen-secured-fields')
        script.src = src
        script.onload = () => resolve(script)
        script.onerror = () => reject(new Error('Script load error: ' + src))
        document.head.append(script)
      })
    },
    createForm () {
      if (Object.keys(this.payment.paymentMethodAdditional).length) {
        this.payment.paymentMethodAdditional = {}
      }
      this.securedFields = window.csf(this.csfSetupObj)
      if (this.securedFields) this.setCallbacks()
    },
    setCallbacks () {
      this.securedFields.onError(() => {
        this.removeCardData()
      })
      this.securedFields.onAllValid((onAllValid) => {
        if (onAllValid.allValid) this.saveCardData()
      })
    },
    saveCardData () {
      this.securedData.encrypted_card_number = document.querySelector('input[name=encryptedCardNumber]').value
      this.securedData.encrypted_expiry_month = document.querySelector('input[name=encryptedExpiryMonth]').value
      this.securedData.encrypted_expiry_year = document.querySelector('input[name=encryptedExpiryYear]').value
      this.securedData.encrypted_security_code = document.querySelector('input[name=encryptedSecurityCode]').value
      store.dispatch('adyen/saveCardData', {cardData: this.securedData})
    },
    removeCardData () {
      store.dispatch('adyen/removeCardData')
    }
  }
}
</script>
