export interface PersonDto {
    personId: number;
    email: string;
    phone: string;
    role: string;
    blocked: boolean;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
    createdAt: Date;
    updatedAt: Date;

    // Extended
    password: string;
}