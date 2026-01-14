// src/features/bills/types/index.js
export const BILL_TYPES = {
  PAKKA: 'pakka',
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

export const INITIAL_KACHA_BUYER = {
  clientName: '',
  clientAddress: ''
  // No GST field for Kacha Bills
};

export const INITIAL_BILL_DATA = {
  buyer: INITIAL_BUYER,
  products: [INITIAL_PRODUCT],
  gstPercentage: 18,
  discount: 0
};

// NEW: Initial data for Kacha Bills
export const INITIAL_KACHA_BILL_DATA = {
  buyer: INITIAL_KACHA_BUYER,
  products: [INITIAL_PRODUCT],
  discount: 0,
  // No GST fields for Kacha Bills
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