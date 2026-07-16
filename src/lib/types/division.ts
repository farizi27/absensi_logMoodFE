export interface Division {
	id: string;
	name: string;
	description?: string;

	createdAt?: string;
	updatedAt?: string;
}

export interface DivisionRequest {
	name: string;
	description?: string;
}