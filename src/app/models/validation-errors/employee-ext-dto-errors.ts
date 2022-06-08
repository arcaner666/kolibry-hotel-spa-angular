export interface EmployeeExtDtoErrors {
    employeeId: string;
    businessId: string;
    branchId: string;
    accountId: string;
    employeeTypeId: string;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender: string;
    notes: string;
    avatarUrl: string;
    identityNumber: string;
    stillWorking: string;
    startDate: string;
    quitDate?: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Account
    accountGroupId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    limit: string;

    // Extended With EmployeeType
    employeeTypeName: string;
}