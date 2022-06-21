import { InvoiceDetailDto } from 'src/app/models/dtos/invoice-detail-dto';
export interface PayTrIframeDto {
    nameSurname: string;
    email: string;
    phone: string;
    address: string;
    paymentAmount: number;
    userBasket: InvoiceDetailDto[];
    merchantOid: string;
    merchantOkUrl: string;
    merchantFailUrl: string;
    userIp: string;
    currency: string;
    language: string;
    iframeToken: string;
}