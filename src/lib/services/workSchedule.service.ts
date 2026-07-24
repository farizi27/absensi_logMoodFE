// src/lib/services/workSchedule.service.ts

import { get, post, put, del } from "./api";
import type {
	WorkScheduleResponse,
	WorkScheduleDetailResponse,
	WorkScheduleRequest,
} from "$lib/types/workSchedule";

/* ===========================
   GET
=========================== */

export function getWorkSchedules() {
	return get<WorkScheduleResponse>("/workSchedules");
}

export function getWorkScheduleById(id: number) {
	return get<WorkScheduleDetailResponse>(`/workSchedules/${id}`);
}

/* ===========================
   CREATE
=========================== */

export function createWorkSchedule(data: WorkScheduleRequest) {
	return post<{ success: boolean; message: string }>("/workSchedules", data);
}

/* ===========================
   UPDATE
=========================== */

export function updateWorkSchedule(id: number, data: WorkScheduleRequest) {
	return put<{ success: boolean; message: string }>(`/workSchedules/${id}`, data);
}

/* ===========================
   DELETE
=========================== */

export function deleteWorkSchedule(id: number) {
	return del<{ success: boolean; message: string }>(`/workSchedules/${id}`);
}
