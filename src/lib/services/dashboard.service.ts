import { get } from "./api";

import type { DashboardResponse } from "$lib/types/dashboard";

export function getDashboard() {
    return get<DashboardResponse>(
        "/admin/dashboard"
    );
}