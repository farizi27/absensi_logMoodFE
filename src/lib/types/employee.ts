// src/lib/types/employee.ts
export interface Employee {
	id: number;
	employeeCode: string;
	fullName: string;
	email: string | null;
	phone: string;
	department: string | null;
	role: string | null;
	status: string;
	photo: string | null;
}

export interface EmployeeResponse {
	success: boolean;
	message: string;
	data: Employee[];
}

export interface EmployeeCreateRequest {
	employee_code: string;
	full_name: string;
	no_phone: string;
	department_id?: number;
	role_id?: number;
}

export interface EmployeeUpdateRequest {
	employee_code: string;
	full_name: string;
	email?: string;
	no_phone: string;
	department_id?: number;
	role_id?: number;
	status?: string;
}