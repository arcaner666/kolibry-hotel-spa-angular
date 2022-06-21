export interface InvoiceExtDtoErrors {
    invoiceId: string;
    currencyId: string;
    buyerNameSurname: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
    buyerIp: string;
    reservationStartDate: string;
    reservationEndDate: string;
    adult: string;
    child: string;
    childAge1: string;
    childAge2: string;
    childAge3: string;
    childAge4: string;
    childAge5: string;
    childAge6: string;
    title: string;
    netPrice: string;
    vat: string;
    totalVat: string;
    totalPrice: string;
    paid: string;
    canceled: string;
    createdAt: string;
    updatedAt: string;
    // Extended With InvoiceType
    // Extended With PaymentType
    // Extended With Currency

    // Extended With InvoiceDetail
    invoiceDetailDtos: string;
}