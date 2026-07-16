export interface ReportFilter {
	startDate: string;
	endDate: string;

	employeeId?: string;

	divisionId?: string;
}

export interface AttendanceReport {
	id: string;

	employeeName: string;

	division: string;

	date: string;

	checkIn?: string;

	checkOut?: string;

	status: "present" | "late" | "absent" | "leave";

	mood?: string;
}

export interface DashboardReport {
	totalEmployees: number;

	totalAttendance: number;

	totalPresent: number;

	totalLate: number;

	totalAbsent: number;

	totalLeave: number;
}