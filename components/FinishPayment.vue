<template>
  <div>
    <div id="threeDS2Container"></div>
    <transition name="fade">
      <div class="threeds-challenge" v-show="threedsChallenge">
        <div id="threeDS2Challenge"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';

export default {
  name: '3DSFingerprint',

  props: {
    callback: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      adyenCheckoutInstance: null,
      threeDS2IdentifyComponent: null,
      threeDS2ChallengeComponent: null,
      threedsChallenge: false
    }
  },

  computed: {
    adyenCard () {
      return this.$store.state['payment-adyen'].adyenCard
    }
  },

  async mounted() {
    if (!document.getElementById('adyen-secured-fields')) {
      if (typeof window !== 'undefined') {
        try {
          await this.loadScript(
            'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/3.3.0/adyen.js'
          );

          this.createForm()

        } catch (err) {
          console.info(err, "Couldnt fetch adyen's library");
        }
      }
    } else {
      this.createForm();
    }
  },

  methods: {
    /**
     * @description - Dynamicly fetches AdyenCheckout class
     */
    loadScript(src) {
      return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.setAttribute('id', 'adyen-secured-fields');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error('Script load error: ' + src));
        document.head.append(script);
      });
    },

    createForm () {
      const originKeys = this.$store.state.config.adyen.originKeys;
          const origin = window.location.origin;
          if (!originKeys[origin]) {
            console.error('[Adyen] Set origin key in the config!');
          }

          const configuration = {
            locale: 'en-US',
            environment: 'test',
            originKey: originKeys[origin],
            paymentMethodsResponse: {
              // There I am setting payment methods
              // For now only scheme === adyen_cc
              paymentMethods: this.$store.getters['payment-adyen/methods'].filter(
                method => method.type === 'scheme'
              ),
              ...(
                this.$store.getters['user/isLoggedIn']
                && this.$store.getters['payment-adyen/cards']
                && !!this.$store.getters['payment-adyen/cards'].length
                ? { storedPaymentMethods: this.$store.getters['payment-adyen/cards'] }
                : {}
              )
            }
          };
          this.adyenCheckoutInstance = new AdyenCheckout(configuration);
          this.initPayment()
    },

    async initPayment () {
      try {
        let result = await this.$store.dispatch(
          'payment-adyen/initPayment',
          this.$store.state['payment-adyen'].adyenCard
        );

        // If it requires 3DS Auth
        if (result.threeDS2) {
          const { token, type } = result;

          switch (type) {
            case 'IdentifyShopper':
              this.renderThreeDS2DeviceFingerprint(token);
              break;
            case 'ChallengeShopper':
              this.renderThreeDS2Challenge(token);
              break;
            default:
              self.$store.dispatch('notification/spawnNotification', {
                type: 'error',
                message: i18n.t(
                  'Unsupported authentication method: ' + type
                ),
                action1: { label: i18n.t('OK') }
              });
              break;
          }
        } else if (result.errorMessage) {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'error',
            message: result.errorMessage,
            action1: { label: i18n.t('OK') }
          });
        } else {
          // 3DS Auth not needed, go further...
          this.callback()
          // self.$emit('payed', this.adyenCard);
        }
      } catch (err) {
        console.error(err, 'Adyen');
      }
    },

    renderThreeDS2DeviceFingerprint(token) {
      this.threeDS2IdentifyComponent = this.adyenCheckoutInstance.create(
        'threeDS2DeviceFingerprint',
        {
          fingerprintToken: token,
          async onComplete({ data }) {
            // It sends request to /adyen/threeDS2Process
            if (!data && data.details && data.details['threeds2.fingerprint']) {
              this.$store.dispatch('notification/spawnNotification', {
                type: 'error',
                message: i18n.t('Could not verify card data, sorry...'),
                action1: { label: i18n.t('OK') }
              });
              return;
            }
            let response = await this.$store.dispatch(
              'payment-adyen/fingerprint3ds',
              {
                fingerprint:
                  data && data.details && data.details['threeds2.fingerprint']
              }
            );

            if (response.threeDS2) {
              // ChallengeShopper
              this.renderThreeDS2Challenge(response.token)
            } else {
              // self.$emit('payed', self.payloadToSend);
              this.callback()
            }
          },
          onError(error) {
            console.log('Error', error);
          }
        }
      );
      this.threeDS2IdentifyComponent.mount('#threeDS2Container');
    },

    renderThreeDS2Challenge(token) {
      // Open fullscreen modal
      this.threedsChallenge = true;

      // Create Challenge component
      const self = this
      this.threeDS2ChallengeComponent = this.adyenCheckoutInstance.create(
        'threeDS2Challenge',
        {
          challengeToken: token,
          // We have a few sizes, 05 is full 100% width 100% height
          // Other ones have certain sizes
          size: '05',
          async onComplete({ data }) {
            if (
              data &&
              data.details &&
              data.details['threeds2.challengeResult']
            ) {
              let challengeResponse = await this.$store.dispatch(
                'payment-adyen/fingerprint3ds',
                {
                  fingerprint: data.details['threeds2.challengeResult'],
                  challenge: true,
                  noPaymentData: true
                }
              );

              this.threedsChallenge = false;

              // Finish the hardest way
              // self.$emit('payed', self.payloadToSend);
              this.callback()
            } else {
              this.$store.dispatch('notification/spawnNotification', {
                type: 'error',
                message: i18n.t('Challenge authentication failed'),
                action1: { label: i18n.t('OK') }
              });
            }
          },
          onError(error) {
            console.log('error', error);
          }
        }
      );
      self.threeDS2ChallengeComponent.mount('#threeDS2Challenge');
    }

  }
}
</script>