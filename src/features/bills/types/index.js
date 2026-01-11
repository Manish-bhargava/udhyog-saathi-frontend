// src/features/bills/types/index.js
export const BILL_TYPES = {
  PACCHA: 'paccha',
  KACHA: 'kacha',
  ALL: 'all'
};

export const GST_RATES = [0, 5, 12, 18, 28];

export const INITIAL_PRODUCT = {
  name: '',
  rate: 0,
  quantity: 1,
  amount: 0
};

export const INITIAL_BUYER = {
  clientName: '',
  clientAddress: '',
  clientGst: ''
};

export const INITIAL_BILL_DATA = {
  buyer: INITIAL_BUYER,
  products: [INITIAL_PRODUCT],
  gstPercentage: 18,
  discount: 0
};

export const INITIAL_COMPANY_DETAILS = {
  companyName: '',
  companyAddress: '',
  GST: '',
  companyPhone: '',
  companyEmail: '',
  companyStamp: '',
  companySignature: ''
};