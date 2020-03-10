<template>
  <div>
    <header class="thank-you-title py35 pl20">
      <div class="container">
        <breadcrumbs
          :routes="[{name: 'Homepage', route_link: '/'}]"
          :active-route="this.$t('Order confirmation')"
        />
        <h2 class="category-title" v-if="resultCode === 'authorised'">
          {{ $t('Order confirmation') }}
        </h2>
        <h2 class="category-title" v-else-if="resultCode === 'cancelled'">
          {{ $t('Order cancelled') }}
        </h2>
        <h2 class="category-title" v-else>
          {{ $t('Order failed') }}
        </h2>
      </div>
    </header>
    <div class="thank-you-content align-justify py20 pl20">
      <div class="container">
        <div class="row">
          <div class="col-md-6 pl20 pr20">
            <h3 v-if="OnlineOnly">
              {{ $t('Thank you!') }}
            </h3>
          </div>
          <div class="col-md-6 thank-you-improvment">
            <h3>
              {{ $t('You have a question, a doubt, or a suggestion?') }}
            </h3>
            <p class="mb25">
              {{ $t('Your feedback is important for us. Let us know what we could improve.') }}
            </p>
            <p class="mb25">
              {{ $t('You can send us an email to') }} <a href="mailto:info@info.com?Subject=Order%20feedback" target="_top"><b>info@info.com</b></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@vue-storefront/core/store'
import VueOfflineMixin from 'vue-offline/mixin'

export default {
  name: 'PaypalResult',
  mixins: [VueOfflineMixin],
  mounted () {
    store.dispatch('adyen/backConfirmation', {route: this.$route})
  },
  data () {
    return {
      payload: this.$route.query.payload,
      resultCode: this.$route.query.resultCode,
      type: this.$route.query.type,
      merchantReference: this.$route.query.merchantReference
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
  .button-outline {
    background-color: black;
  }
  .thank-you-content {
    padding-left: 0;

    p {
      line-height: 25px
    }

    @media (min-width: 64em) {
      h4 {
        font-size: 24px;
      }
    }
  }
  .thank-you-improvment {
    padding: 0 10px 15px;

    @media (min-width: 64em) {
      padding: 0 40px 10px;
    }

    textarea {
      min-height: 100px;
    }
  }
</style>
