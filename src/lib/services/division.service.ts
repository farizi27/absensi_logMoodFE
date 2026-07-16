import { del, get, post, put } from "./api";

import type {
	Division,
	DivisionRequest
} from "$lib/types/division";

/* ===========================
   GET ALL
=========================== */

export function getDivisions() {
	return get<Division[]>("/divisions");
}

/* ===========================
   GET BY ID
=========================== */

export function getDivision(id: string) {
	return get<Division>(`/divisions/${id}`);
}

/* ===========================
   CREATE
=========================== */

export function createDivision(
	data: DivisionRequest
) {
	return post<Division>(
		"/divisions",
		data
	);
}

/* ===========================
   UPDATE
=========================== */

export function updateDivision(
	id: string,
	data: DivisionRequest
) {
	return put<Division>(
		`/divisions/${id}`,
		data
	);
}

/* ===========================
   DELETE
=========================== */

export function deleteDivision(id: string) {
	return del<void>(
		`/divisions/${id}`
	);
}