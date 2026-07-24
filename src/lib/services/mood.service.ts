// src/lib/services/mood.service.ts

import { del, get, post, put, getBlob } from "./api";

import type {
	MoodJournal,
	MoodJournalResponse,
	MoodRequest,
} from "$lib/types/mood";

/* ===========================
   GET
=========================== */

export function getMoodJournals() {
	return get<MoodJournalResponse>("/moodJournals");
}

export function getMyMoodJournals() {
	return get<MoodJournalResponse>("/moodJournals/my-journals");
}

/* ===========================
   CREATE
=========================== */

export function createMoodJournal(data: MoodRequest) {
	return post<{ success: boolean; message: string }>(
		"/moodJournals",
		data
	);
}

/* ===========================
   UPDATE
=========================== */

export function updateMoodJournal(
	id: number,
	data: MoodRequest
) {
	return put<{ success: boolean; message: string }>(
		`/moodJournals/${id}`,
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteMoodJournal(id: number) {
	return del<{ success: boolean; message: string }>(
		`/moodJournals/${id}`
	);
}

export function exportMonthlyMoodExcel(
	month?: number,
	year?: number
) {
	const params = new URLSearchParams();

	const today = new Date();
	const m = month || (today.getMonth() + 1);
	const y = year || today.getFullYear();

	params.append("month", String(m));
	params.append("year", String(y));

	return getBlob(`/moodJournals/mood-monthly?${params.toString()}`);
}