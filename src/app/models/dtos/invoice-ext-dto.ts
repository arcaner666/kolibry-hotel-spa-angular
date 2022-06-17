import { InvoiceDetailDto } from "src/app/models/dtos/invoice-detail-dto";

export interface InvoiceExtDto {
    invoiceId: number;
    currencyId: number;
    buyerNameSurname: string;
    buyerEmail: string;
    buyerPhone: string;
    reservationStartDate: Date;
    reservationEndDate: Date;
    adult: number;
    child: number;
    childAge1: number;
    childAge2: number;
    childAge3: number;
    childAge4: number;
    childAge5: number;
    childAge6: number;
    title: string;
    netPrice: number;
    vat: number;
    totalVat: number;
    totalPrice: number;
    paid: boolean;
    canceled: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Extended With InvoiceType
    // Extended With PaymentType
    // Extended With Currency

    // Extended With InvoiceDetail
    invoiceDetailDtos: InvoiceDetailDto[];
}