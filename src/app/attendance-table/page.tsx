import AttendanceTable from '@/app/attendance-table/_components/attendanceTable';

export default function Page() {
  return (
    <div className="flex items-center flex-col">
      <h1 className="text-5xl mb-5">若手交流会</h1>
      <div className="mb-5">ここに説明が入ります</div>
      <AttendanceTable />
    </div>
  );
}
