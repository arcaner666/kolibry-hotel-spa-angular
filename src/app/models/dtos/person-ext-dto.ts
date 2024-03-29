﻿export interface PersonExtDto {
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
  oldPassword: string;
  password: string;
  passwordAgain: string;
  refreshTokenDuration: number;
  accessToken: string;
}
