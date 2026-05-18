export interface CreateEmployeesDTO {
    documentType: string;
    document: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    module: string;
}

export interface UpdateEmployeesDTO {
    documentType?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    module?: string;
}