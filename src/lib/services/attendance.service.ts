// src/lib/services/attendance.service.ts

import { del, get, post, put } from "./api";

import type {
	AttendanceLog,
	AttendanceResponse,
	AttendanceRequest
} from "$lib/types/attendance";

/* ===========================
   GET ALL (Admin)
=========================== */

export function getAllAttendanceLogs() {
	return get<AttendanceResponse>("/attedanceLogs");
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