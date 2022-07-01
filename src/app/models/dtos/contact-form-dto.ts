export interface ContactFormDto {
    contactFormId: number;
    nameSurname: string;
    email: string;
    phone: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}