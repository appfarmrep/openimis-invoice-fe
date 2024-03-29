export function formatInvoiceGQL(invoice) {
    return `
      ${!!invoice.id ? `id: "${decodeId(invoice.id)}"` : ""}
      ${!!invoice.status ? `status: "${invoice.status}"` : ""}  
      ${!!invoice.note ? `note: "${invoice.note}"` : ""}
      ${!!invoice.paymentReference ? `paymentReference: "${invoice.paymentReference}"` : ""}
    `;
  }