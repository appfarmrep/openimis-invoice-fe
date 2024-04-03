import create from 'zustand';

export const useStore = create(set => ({
  invoiceStatus: '',
  invoiceNote: '',
  invoicePaymentReference: '',
  setInvoiceStatus: (status) => set({ invoiceStatus: status }),
  setInvoiceNote: (note) => set({ invoiceNote: note }),
  setInvoicePaymentReference: (paymentReference) => set({ invoicePaymentReference: paymentReference }),
}));