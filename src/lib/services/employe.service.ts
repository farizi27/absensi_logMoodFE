// src/lib/services/employee.service.ts

import { del, get, post, put, patch } from "./api";

import type {
	Employee,
	EmployeeResponse,
	EmployeeCreateRequest,
	EmployeeUpdateRequest
} from "$lib/types/employee";

/* ===========================
   GET ALL
=========================== */

export function getEmployees() {
	return get<EmployeeResponse>("/employees");
}

/* ===========================
   GET BY ID
=========================== */

export function getEmployee(id: number) {
	return get<Employee>(`/employees/${id}`);
}

/* ===========================
   CREATE
=========================== */

export function createEmployee(
	data: EmployeeCreateRequest
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
	id: number,
	data: EmployeeUpdateRequest
) {
	return put<Employee>(
		`/employees/${id}`,
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteEmployee(id: number) {
	return del<void>(
		`/employees/${id}`
	);
}

/* ===========================
   ACTIVE / INACTIVE
=========================== */

export function updateEmployeeStatus(
	id: number,
	isActive: boolean
) {
	return patch<Employee>(
		`/employees/${id}/status`,
		{
			isActive
		}
	);
}