export interface DashboardSummary {
    totalEmployees: number;
    attendanceToday: number;
    attendancePercentage: number;
    averageMood: string;
    totalDepartments: number;
}

export interface RecentAttendance {
    id: number;
    employeeName: string;
    department: string | null;
    checkIn: string | null;
    attendanceStatus: "present" | "late" | "absent";
    mood: string | null;
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: {
        summary: DashboardSummary;
        recentAttendance: RecentAttendance[];
    };
}