export type MoodLevel = "Excited" | "Happy" | "Neutral" | "Tired" | "Stressed";

export interface MoodJournal {
	id: number;
	employeeId: number;
	employeeName: string | null;
	attendanceLogId: number | null;
	moodLevel: MoodLevel;
	note: string | null;
	createdAt: string;
}

export interface MoodJournalResponse {
	success: boolean;
	data: MoodJournal[];
}

export interface MoodRequest {
	moodLevel: MoodLevel;
	note?: string;
	attendanceLogId?: number;
}

// Mapping mood levels to Indonesian labels for UI
export const MOOD_LABEL: Record<MoodLevel, string> = {
	Excited: "Semangat",
	Happy: "Senang",
	Neutral: "Biasa",
	Tired: "Lelah",
	Stressed: "Stres"
};

export const MOOD_EMOJI: Record<MoodLevel, string> = {
	Excited: "🤩",
	Happy: "😊",
	Neutral: "😐",
	Tired: "🥱",
	Stressed: "😠"
};