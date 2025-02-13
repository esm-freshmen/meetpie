import AttendanceTable from '@/app/attendance/_components/attendanceTable';
import { prisma } from '../../libs';

export default async function Page() {
  const user = await prisma.user.findMany();
  console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
  console.log(JSON.stringify(user));
  console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');

  return (
    <div className='mt-28 flex flex-col items-center'>
      <h1 className='mb-5 text-5xl'>若手交流会</h1>
      <div className='mb-5 text-lg'>ここに説明が入ります</div>
      <AttendanceTable />
    </div>
  );
}
