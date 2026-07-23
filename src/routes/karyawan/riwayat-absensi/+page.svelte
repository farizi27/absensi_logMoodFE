<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";

	const history = [
		{ date: "2026-07-22", checkIn: "07:55 AM", checkOut: "17:02 PM", status: "Tepat Waktu" as const },
		{ date: "2026-07-21", checkIn: "07:58 AM", checkOut: "17:05 PM", status: "Tepat Waktu" as const },
		{ date: "2026-07-20", checkIn: "08:15 AM", checkOut: "17:00 PM", status: "Terlambat" as const },
		{ date: "2026-07-19", checkIn: "-", checkOut: "-", status: "Izin" as const },
		{ date: "2026-07-18", checkIn: "07:50 AM", checkOut: "17:00 PM", status: "Tepat Waktu" as const }
	];
</script>

<svelte:head>
	<title>Riwayat Absensi - Karyawan</title>
</svelte:head>

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Riwayat Absensi</h1>
			<p>Daftar riwayat kehadiran presensi bulanan Anda.</p>
		</div>
	</div>

	<Card border padding="lg">
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Tanggal</th>
					<th>Jam Masuk</th>
					<th>Jam Keluar</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each history as item}
					<tr>
						<td><strong>{item.date}</strong></td>
						<td>{item.checkIn}</td>
						<td>{item.checkOut}</td>
						<td>
							<Badge variant={item.status === 'Tepat Waktu' ? 'success' : item.status === 'Terlambat' ? 'warning' : 'info'}>
								{item.status}
							</Badge>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
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
</style>
