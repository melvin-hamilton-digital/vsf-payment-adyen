# Vue Storefront Adyen Payment Module

Use at Your own risk.

###Features:
- [x] Adyen CreditCard payment
- [x] Adyen field validation and encryption.

###To be done:
- [ ] Add notifications depend on Adyen callbacks.
- [ ] Add other payments methods.

If you have any questions or suggestion then please feel free to drop a line ;)

## Installation:

```shell
$ git clone git@github.com:melvin-hamilton-digital/vsf-payment-adyen.git ./vue-storefront/src/modules/adyen
```

Add API Key to your `config/local.json`.
```json
"adyen": {
  "originKey": "origin_key"
}
```
[How to get the API key](https://docs.adyen.com/developers/user-management/how-to-get-the-api-key)

## Register the Adyen module

In `./src/modules/index.ts`

```js
...
import { Adyen } from './adyen'

export const registerModules: VueStorefrontModule[] = [
  ...,
  Adyen
]
```

## Checkout/Payment
Under your theme `components/core/blocks/Checkout/Payment.vue`.

```js
import CardForm from 'src/modules/adyen/components/CardForm'

export default {
  components: {
    ...
    CardForm
  },
  ...
  computed: {
  ...
    isAdyenValid () {
      return this.$store.state.adyen.isAdyenValid
    }
  },
```

Also add form component to your template:

```html
<card-form v-if="payment.paymentMethod === 'adyenCreditCard'"/>
```
and !isAdyenValid to "Go review the order" button, for disabling it until all card data was validate.
```html
<button-full
  @click.native="sendDataToCheckout"
  data-testid="paymentSubmit"
  :disabled="$v.payment.$invalid || !isAdyenValid"
>
  {{ $t('Go review the order') }}
</button-full>
```

## References
In vue-storefront/src/modules/adyen/components/CardForm.vue find `csfSetupObj` inside you can add styles, placeholders, define rootNode etc.

[Styling Secured Fields](https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields)

```js
export default {
  name: 'CardForm',
  data () {
    return {
      ...
      csfSetupObj: {
```
