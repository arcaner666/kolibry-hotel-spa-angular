export interface InvoiceDetailDto {
    invoiceDetailId: number;
    invoiceId: number;
    suiteId: number;
    amount: number;
    price: number;
    vat: number;
    totalVat: number;
    totalPrice: number;
}