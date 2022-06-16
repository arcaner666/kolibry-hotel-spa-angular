export interface PersonExtDtoErrors {
  personId: string;
  email: string;
  phone: string;
  role: string;
  blocked: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  createdAt: string;
  updatedAt: string;

  // Extended
  oldPassword: string;
  password: string;
  passwordAgain: string;
  refreshTokenDuration: string;
  accessToken: string;
}
