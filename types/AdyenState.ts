interface PaymentDetail {
    key: string,
    type: string,
    optional?: Boolean
}

interface PaymentIcon {
    url: string,
    width: Number,
    height: Number
}

interface PaymentMethod {
    type: string,
    title: string,
    isPaymentMethodOpenInvoiceMethod: Boolean,
    icon: PaymentIcon | null,
    supportRecurring?: Boolean,
    details?: Array<PaymentDetail>,
    brands?: Array<string>
}

export interface AdyenState {
    isAdyenValid: boolean | null,
    adyenCard: any | null,
    paymentMethods: Array<PaymentMethod>,
    saveCard: Boolean,
    loadedCards: Array<any>,
    publicHash: string | null
}
