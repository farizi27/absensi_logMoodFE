export interface Department {
    id: number;
    departmentsName: string;
    description: string;
}

export interface DepartmentResponse {
    success: boolean;
    message: string;
    data: Department[];
}

export interface DepartmentDetailResponse {
    success: boolean;
    message: string;
    data: Department;
}

export interface DepartmentRequest {
    departmentsName: string;
    description: string;
}