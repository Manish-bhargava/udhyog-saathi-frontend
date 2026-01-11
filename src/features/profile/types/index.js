// src/features/profile/types/index.js
export const PROFILE_SECTIONS = {
  COMPANY: 'company',
  PERSONAL: 'personal',
  PASSWORD: 'password'
};

export const PROFILE_STATUS = {
  INCOMPLETE: 'incomplete',
  PENDING: 'pending',
  COMPLETE: 'complete'
};

export const COMPANY_FIELDS = [
  'companyName',
  'GST',
  'companyAddress',
  'companyPhone',
  'companyEmail',
  'companyLogo',
  'companyDescription',
  'companyStamp',
  'companySignature'
];

export const BANK_FIELDS = [
  'accountNumber',
  'IFSC',
  'bankName',
  'branchName'
];

export const PERSONAL_FIELDS = [
  'firstName',
  'lastName',
  'email'
];