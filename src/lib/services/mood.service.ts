// src/lib/services/mood.service.ts

import { del, get, post, put } from "./api";

import type {
	Mood,
	MoodRequest,
	MoodStatistic
} from "$lib/types/mood";

/* ===========================
   GET
=========================== */

export function getMoods() {
	return get<Mood[]>("/moods");
}

export function getMood(id: string) {
	return get<Mood>(`/moods/${id}`);
}

export function getTodayMood() {
	return get<Mood>("/moods/today");
}

export function getMoodHistory() {
	return get<Mood[]>("/moods/history");
}

export function getMoodStatistic() {
	return get<MoodStatistic>("/moods/statistic");
}

/* ===========================
   CREATE
=========================== */

export function createMood(
	data: MoodRequest
) {
	return post<Mood>(
		"/moods",
		data
	);
}

/* ===========================
   UPDATE
=========================== */

export function updateMood(
	id: string,
	data: MoodRequest
) {
	return put<Mood>(
		`/moods/${id}`,
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteMood(id: string) {
	return del<void>(
		`/moods/${id}`
	);
}