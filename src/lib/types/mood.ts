export type MoodType =
	| "happy"
	| "excited"
	| "neutral"
	| "tired"
	| "sad"
	| "angry";

export interface Mood {
	id: string;

	employeeId: string;
	employeeName?: string;

	mood: MoodType;

	note?: string;

	date: string;

	createdAt?: string;
	updatedAt?: string;
}

export interface MoodRequest {
	mood: MoodType;
	note?: string;
}

export interface MoodStatistic {
	happy: number;
	excited: number;
	neutral: number;
	tired: number;
	sad: number;
	angry: number;
}