// src/lib/types/attendance.ts

export interface Attendance {
	id: string;

	employeeId: string;
	employeeName: string;

	date: string;

	checkIn?: string;
	checkOut?: string;

	status: "present" | "late" | "absent" | "leave";

	mood?: string;

	notes?: string;
}

export interface AttendanceRequest {
	mood?: string;
	notes?: string;
}

export interface AttendanceStatistic {
	totalEmployee: number;
	present: number;
	late: number;
	absent: number;
	leave: number;
}