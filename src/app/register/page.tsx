import AttendanceTable from '@/app/attendance/_components/attendanceTable';
import { prisma } from '../lib';

export default async function Page() {
  return (
    <div className='mt-28 flex flex-col items-center'>
      <h1 className='mb-5 text-5xl'>出欠表作成画面</h1>
    </div>
  );
}
