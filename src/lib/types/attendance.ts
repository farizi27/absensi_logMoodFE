// src/lib/types/attendance.ts

export interface AttendanceLog {
	id: number;
	employeeId: number;
	employeeName: string | null;
	departmentName: string | null;
	attendanceDate: string;
	checkIn: string | null;
	checkOut: string | null;
	workingHours: string | null;
	attendanceStatus: "present" | "late" | "absent" | string;
	createdAt: string;
}

export interface AttendanceResponse {
	success: boolean;
	data: AttendanceLog[];
}

export interface AttendanceRequest {
	latitude: number;
	longitude: number;
}