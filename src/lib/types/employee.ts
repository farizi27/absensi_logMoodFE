export type Gender = "L" | "P";

export interface Employee {
	id: string;

	name: string;
	email: string;

	phone?: string;

	address?: string;

	gender: Gender;

	divisionId: string;
	divisionName?: string;

	position: string;

	photo?: string;

	isActive: boolean;

	createdAt?: string;
	updatedAt?: string;
}

export interface EmployeeRequest {
	name: string;
	email: string;

	phone?: string;

	address?: string;

	gender: Gender;

	divisionId: string;

	position: string;

	password?: string;

	photo?: string;
}