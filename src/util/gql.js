export function formatInvoiceGQL(invoice) {
    return `
      ${!!invoice.id ? `id: "${invoice.id}"` : ""}
      ${!!invoice.status ? `status: "${invoice.status}"` : ""}  
      ${!!invoice.note ? `note: "${invoice.note}"` : ""}
      ${!!invoice.paymentReference ? `paymentReference: "${invoice.paymentReference}"` : ""}
    `;
  }

  export function formatUpdateInvoiceGQL(invoice) {
    // Add other fields that can be updated
    return `
      ${!!invoice.id ? `id: "${invoice.id}"` : ""}
      ${!!invoice.status ? `status: "${invoice.status}"` : ""}  
      ${!!invoice.note ? `note: "${invoice.note}"` : ""}
      ${!!invoice.paymentReference ? `paymentReference: "${invoice.paymentReference}"` : ""}
    `;
}