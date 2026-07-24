<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import { exportMonthlyAttendanceExcel, exportDepartmentMonthlyExcel } from "$lib/services/attendance.service"
	import { exportMonthlyMoodExcel } from "$lib/services/mood.service"
	import { FileSpreadsheet, FileText, Printer, Download } from "@lucide/svelte";
	
	const reportOptions = [
		{ title: "Laporan Kehadiran Bulanan", desc: "Rekap persentase kehadiran, ketepatan waktu, dan izin karyawan.", icon: FileSpreadsheet, badge: "PDF & Excel" },
		{ title: "Laporan Mood & Stres Kerja", desc: "Analisis distribusi tingkat kebahagiaan dan beban emosional karyawan.", icon: FileText, badge: "PDF" },
		{ title: "Laporan Per Divisi", desc: "Perbandingan performa presensi dan mood berdasarkan departemen.", icon: Printer, badge: "Excel" }
	];

	// Toast
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");
	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}
	async function exportExcel() {
	try {
		const blob = await exportMonthlyAttendanceExcel();
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;

		const today = new Date();

		link.download = `Attendance-${
			today.getMonth() + 1
		}-${today.getFullYear()}.xlsx`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		showToast("Export berhasil.", "success");
		} catch (err: any) {
			showToast(err.message || "Gagal export.", "danger");
		}
	}

	async function exportMoodExcel() {
	try {
		const blob = await exportMonthlyMoodExcel();
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;

		const today = new Date();

		link.download = `Mood-${
			today.getMonth() + 1
		}-${today.getFullYear()}.xlsx`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		showToast("Export berhasil.", "success");
		} catch (err: any) {
			showToast(err.message || "Gagal export.", "danger");
		}
	}

	async function exportDepartmentExcel() {
	try {
		const blob = await exportDepartmentMonthlyExcel();
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;

		const today = new Date();

		link.download = `Department-Attendance-${
			today.getMonth() + 1
		}-${today.getFullYear()}.xlsx`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		showToast("Export berhasil.", "success");
		} catch (err: any) {
			showToast(err.message || "Gagal export.", "danger");
		}
	}
</script>

<svelte:head>
	<title>Laporan & Rekapitulasi - Admin</title>
</svelte:head>

<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Laporan & Rekapitulasi</h1>
			<p>Unduh laporan bulanan presensi dan evaluasi kesehatan mental karyawan.</p>
		</div>
	</div>

	<!-- Using Card, Button, Badge UI components -->
	<div class="reports-grid">
		{#each reportOptions as r}
			<Card hover border padding="lg">
				<div class="card-head">
					<div class="icon-wrap">
						<r.icon size={26} />
					</div>
					<Badge variant="primary">{r.badge}</Badge>
				</div>
				<h3 class="report-title">{r.title}</h3>
				<p class="report-desc">{r.desc}</p>
				<div class="card-footer">
					{#if r.title ==="Laporan Kehadiran Bulanan"}
					<Button size="sm" onClick={exportExcel}>
						<Download size={16} style="margin-right: 6px;" />
						Export Laporan
					</Button>
					{:else if r.title === "Laporan Mood & Stres Kerja"}
					<Button size="sm" onClick={exportMoodExcel}>
						<Download size={16} style="margin-right: 6px;" />
						Export Laporan
					</Button>
					{:else if r.title === "Laporan Per Divisi"}
					<Button size="sm" onClick={exportDepartmentExcel}>
						<Download size={16} style="margin-right: 6px;" />
						Export Laporan
					</Button>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header-action h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.header-action p {
		color: var(--color-text-light);
		font-size: 0.95rem;
	}

	.reports-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--color-primary-light, #dbeafe);
		color: var(--color-primary, #2563eb);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.report-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
	}

	.report-desc {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin: 0 0 1.25rem 0;
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
	}
</style>
