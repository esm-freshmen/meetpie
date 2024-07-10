import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Tab } from '@mui/material';
import { attachReactRefresh } from 'next/dist/build/webpack-config';

function AttendanceTable() {
  function createData(time: string, attendanceCounts: number[]) {
    return { time, attendanceCounts };
  }

  const rows = [
    createData('9:00', [1, 2, 3, 4]),
    createData('10:00', [1, 2, 3, 4]),
    createData('10:00', [1, 2, 3, 4]),
    createData('11:00', [1, 2, 3, 4]),
    createData('12:00', [1, 2, 3, 4]),
    createData('13:00', [1, 2, 3, 4]),
  ];

  return (
    // TODO: テーブルの横幅を狭める
    <table className="text-center">
      <thead>
        <tr>
          <th className="w-[100px] bg-brown-10 border border-black"></th>
          <th className="w-[100px] bg-brown-10 border border-black">6/10</th>
          <th className="w-[100px] bg-brown-10 border border-black">6/11</th>
          <th className="w-[100px] bg-brown-10 border border-black">6/12</th>
          <th className="w-[100px] bg-brown-10 border border-black">6/13</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            <td className="bg-brown-10 border border-black">{row.time}</td>
            {row.attendanceCounts.map((attendanceCount) => (
              <td className="border border-black">{attendanceCount}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;
