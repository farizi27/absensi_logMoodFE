import { del, get, post, put} from "./api";
import type {
    Department,
    DepartmentRequest,
    DepartmentResponse,
    DepartmentDetailResponse
} from "$lib/types/department";

export function getDepartments() {
    return get<DepartmentResponse>("/departments");
}

export function getDepartment(id: number) {
    return get<DepartmentDetailResponse>(`/departments/${id}`);
}

export function createDepartment(data: DepartmentRequest) {
    return post<DepartmentDetailResponse>(
        "/departments",
        data
    );
}

export function updateDepartment(
    id: number,
    data: DepartmentRequest
) {
    return put<DepartmentDetailResponse>(
        `/departments/${id}`,
        data
    );
}

export function deleteDepartment(id: number) {
    return del<{
        success: boolean;
        message: string;
    }>(`/departments/${id}`);
}