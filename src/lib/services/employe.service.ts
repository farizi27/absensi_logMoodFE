// src/lib/services/employee.service.t
import { del, get, postForm, putForm, patch } from "./api";

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
	return get<{ success: boolean; data: Employee }>(`/employees/${id}`);
}

/* ===========================
   CREATE
=========================== */

export function createEmployee(
	data: EmployeeCreateRequest
) {
	const formData: Record<string, string> = {
		employee_code: data.employee_code,
		full_name: data.full_name,
		no_phone: data.no_phone,
	};
	if (data.department_id !== undefined && data.department_id !== null) {
		formData.department_id = String(data.department_id);
	}
	if (data.role_id !== undefined && data.role_id !== null) {
		formData.role_id = String(data.role_id);
	}
	if (data.work_schedule_id !== undefined && data.work_schedule_id !== null) {
		formData.workScheduleId = String(data.work_schedule_id);
	}

	return postForm<{ success: boolean; data: Employee }>(
		"/employees",
		formData
	);
}

/* ===========================
   UPDATE
=========================== */

export function updateEmployee(
	id: number,
	data: EmployeeUpdateRequest
) {
	const formData: Record<string, string> = {
		employee_code: data.employee_code,
		full_name: data.full_name,
		no_phone: data.no_phone,
	};
	if (data.email) formData.email = data.email;
	if (data.status) formData.status = data.status;
	if (data.department_id !== undefined && data.department_id !== null) {
		formData.department_id = String(data.department_id);
	}
	if (data.role_id !== undefined && data.role_id !== null) {
		formData.role_id = String(data.role_id);
	}
	if (data.work_schedule_id !== undefined && data.work_schedule_id !== null) {
		formData.workScheduleId = String(data.work_schedule_id);
	}

	return putForm<{ success: boolean; data: Employee }>(
		`/employees/${id}`,
		formData
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteEmployee(id: number) {
	return del<{ success: boolean; message: string }>(
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