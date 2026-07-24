import {
	LayoutDashboard,
	Users,
	Building2,
	CalendarDays,
	ClipboardList,
	ChartColumn,
	UserCircle,
	Clock
} from "@lucide/svelte";

import type { Component } from "svelte";

/* ===========================
   TYPES
=========================== */

export interface NavigationItem {
	label: string;
	href: string;
	icon: Component;

	// Optional
	badge?: string | number;
	disabled?: boolean;

	// Untuk menu bertingkat jika nanti diperlukan
	children?: NavigationItem[];
}

export interface NavigationGroup {
	title: string;
	items: NavigationItem[];
}

/* ===========================
   ADMIN
=========================== */

export const adminNavigation: NavigationGroup[] = [
	{
		title: "MAIN",
		items: [
			{
				label: "Dashboard",
				href: "/admin/dashboard",
				icon: LayoutDashboard
			}
		]
	},

	{
		title: "MASTER DATA",
		items: [
			{
				label: "Data Karyawan",
				href: "/admin/karyawan",
				icon: Users
			},
			{
				label: "Department",
				href: "/admin/divisi",
				icon: Building2
			},
			{
				label: "Jadwal Kerja",
				href: "/admin/work_schedule",
				icon: Clock
			}
		]
	},

	{
		title: "MONITORING",
		items: [
			{
				label: "Absensi",
				href: "/admin/absensi",
				icon: ClipboardList
			},
			{
				label: "Mood Monitoring",
				href: "/admin/mood-monitoring",
				icon: ChartColumn
			},
			{
				label: "Laporan",
				href: "/admin/laporan",
				icon: ClipboardList
			}
		]
	}
];

/* ===========================
   KARYAWAN
=========================== */

export const karyawanNavigation: NavigationGroup[] = [
	{
		title: "MAIN",
		items: [
			{
				label: "Dashboard",
				href: "/karyawan/dashboard",
				icon: LayoutDashboard
			}
		]
	},

	{
		title: "ABSENSI",
		items: [
			{
				label: "Absensi",
				href: "/karyawan/absensi",
				icon: CalendarDays
			},
			{
				label: "Riwayat Absensi",
				href: "/karyawan/riwayat-absensi",
				icon: ClipboardList
			},
			{
				label: "Mood Jurnal",
				href: "/karyawan/mood-jurnal",
				icon: ChartColumn
			}
		]
	},

	{
		title: "AKUN",
		items: [
			{
				label: "Profil",
				href: "/karyawan/profile",
				icon: UserCircle
			}
		]
	}
];