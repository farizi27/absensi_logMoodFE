// src/lib/services/employee.service.ts

import { del, get, post, put, patch } from "./api";

import type {
	Employee,
	EmployeeRequest
} from "$lib/types/employee";

/* ===========================
   GET ALL
=========================== */

export function getEmployees() {
	return get<Employee[]>("/employees");
}

/* ===========================
   GET BY ID
=========================== */

export function getEmployee(id: string) {
	return get<Employee>(`/employees/${id}`);
}

/* ===========================
   CREATE
=========================== */

export function createEmployee(
	data: EmployeeRequest
) {
	return post<Employee>(
		"/employees",
		data
	);
}

/* ===========================
   UPDATE
=========================== */

export function updateEmployee(
	id: string,
	data: EmployeeRequest
) {
	return put<Employee>(
		`/employees/${id}`,
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteEmployee(id: string) {
	return del<void>(
		`/employees/${id}`
	);
}

/* ===========================
   ACTIVE / INACTIVE
=========================== */

export function updateEmployeeStatus(
	id: string,
	isActive: boolean
) {
	return patch<Employee>(
		`/employees/${id}/status`,
		{
			isActive
		}
	);
}