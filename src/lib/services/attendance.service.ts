// src/lib/services/attendance.service.ts

import { del, get, post, put, getBlob } from "./api";

import type {
	AttendanceLog,
	AttendanceResponse,
	AttendanceRequest,
} from "$lib/types/attendance";

/* ===========================
   GET ALL (Admin)
=========================== */

export function getAllAttendanceLogs() {
	return get<AttendanceResponse>("/attedanceLogs");
}

export async function exportMonthlyAttendanceExcel(
	employeeId?: number,
	month?: number,
	year?: number
) {
	const params = new URLSearchParams();

	const today = new Date();
	const m = month || (today.getMonth() + 1);
	const y = year || today.getFullYear();

	params.append("month", String(m));
	params.append("year", String(y));

	if (employeeId) {
		params.append("employeeId", String(employeeId));
	}

	const query = params.toString();

	return getBlob(
		`/attedanceLogs/report-monthly?${query}`
	);
}

/* ===========================
   GET MY HISTORY (Employee)
=========================== */

export function getMyAttendanceHistory() {
	return get<AttendanceResponse>("/attedanceLogs/my-history");
}

/* ===========================
   CHECK IN
=========================== */

export function checkIn(data: AttendanceRequest) {
	return post<{ success: boolean; message: string; data: AttendanceLog }>(
		"/attedanceLogs/check-in",
		data
	);
}

/* ===========================
   CHECK OUT
=========================== */

export function checkOut(data: AttendanceRequest) {
	return put<{ success: boolean; message: string; data: AttendanceLog }>(
		"/attedanceLogs/check-out",
		data
	);
}

export async function exportDepartmentMonthlyExcel(
	month?: number,
	year?: number
) {
	const params = new URLSearchParams();

	const today = new Date();
	const m = month || (today.getMonth() + 1);
	const y = year || today.getFullYear();

	params.append("month", String(m));
	params.append("year", String(y));

	return getBlob(`/attedanceLogs/report-monthly-departments?${params.toString()}`);
}