import { get, post } from "./api";

import type {
	AttendanceReport,
	DashboardReport,
	ReportFilter
} from "$lib/types/report";

/* ===========================
   DASHBOARD
=========================== */

export function getDashboardReport() {
	return get<DashboardReport>(
		"/reports/dashboard"
	);
}

/* ===========================
   ATTENDANCE REPORT
=========================== */

export function getAttendanceReport(
	filter: ReportFilter
) {
	return post<AttendanceReport[]>(
		"/reports/attendance",
		filter
	);
}

/* ===========================
   EXPORT EXCEL
=========================== */

export function exportAttendanceExcel(
	filter: ReportFilter
) {
	return post<Blob>(
		"/reports/attendance/excel",
		filter
	);
}

/* ===========================
   EXPORT PDF
=========================== */

export function exportAttendancePdf(
	filter: ReportFilter
) {
	return post<Blob>(
		"/reports/attendance/pdf",
		filter
	);
}