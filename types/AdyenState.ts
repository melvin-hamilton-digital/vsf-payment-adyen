interface PaymentDetail {
  key: string,
  type: string,
  optional?: boolean
}

interface PaymentIcon {
  url: string,
  width: number,
  height: number
}

interface PaymentMethod {
  type: string,
  title: string,
  isPaymentMethodOpenInvoiceMethod: boolean,
  icon: PaymentIcon | null,
  supportRecurring?: boolean,
  details?: PaymentDetail[],
  brands?: string[]
}

export interface AdyenState {
  isAdyenValid: boolean | null,
  adyenCard: any | null,
  paymentMethods: PaymentMethod[],
  saveCard: boolean,
  loadedCards: any[],
  publicHash: string | null
}
