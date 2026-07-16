// src/lib/services/attendance.service.ts

import { del, get, post, put } from "./api";

import type {
	Attendance,
	AttendanceRequest,
	AttendanceStatistic
} from "$lib/types/attendance";

/* ===========================
   GET
=========================== */

export function getAttendances() {
	return get<Attendance[]>("/attendance");
}

export function getAttendance(id: string) {
	return get<Attendance>(`/attendance/${id}`);
}

export function getTodayAttendance() {
	return get<Attendance>("/attendance/today");
}

export function getAttendanceHistory() {
	return get<Attendance[]>("/attendance/history");
}

export function getAttendanceStatistic() {
	return get<AttendanceStatistic>("/attendance/statistic");
}

/* ===========================
   CHECK IN
=========================== */

export function checkIn(
	data: AttendanceRequest
) {
	return post<Attendance>(
		"/attendance/check-in",
		data
	);
}

/* ===========================
   CHECK OUT
=========================== */

export function checkOut(
	data: AttendanceRequest
) {
	return put<Attendance>(
		"/attendance/check-out",
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteAttendance(id: string) {
	return del<void>(`/attendance/${id}`);
}