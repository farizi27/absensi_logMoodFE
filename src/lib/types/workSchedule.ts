export interface WorkSchedule {
	id: number;
	scheduleName: string;
	startTime: string;    // "HH:MM:SS"
	endTime: string;      // "HH:MM:SS"
	toleranceMinutes: number;
	createdAt: string;
}

export interface WorkScheduleResponse {
	success: boolean;
	data: WorkSchedule[];
}

export interface WorkScheduleDetailResponse {
	success: boolean;
	data: WorkSchedule;
}

export interface WorkScheduleRequest {
	scheduleName: string;
	startTime: string;
	endTime: string;
	toleranceMinutes: number;
}
