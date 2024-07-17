import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Tab } from '@mui/material';
import { attachReactRefresh } from 'next/dist/build/webpack-config';

function AttendanceTable() {
  function createData(id: number, time: string, attendanceCounts: number[]) {
    return { id, time, attendanceCounts };
  }

  const rows = [
    createData(1, '9:00', [1, 2, 3, 4]),
    createData(2, '10:00', [1, 2, 3, 4]),
    createData(3, '10:00', [1, 2, 3, 4]),
    createData(4, '11:00', [1, 2, 3, 4]),
    createData(5, '12:00', [1, 2, 3, 4]),
    createData(6, '13:00', [1, 2, 3, 4]),
  ];

  return (
    // TODO: テーブルの横幅を狭める
    <table className="text-center">
      <thead>
        <tr>
          <th className="w-[100px] border border-black bg-brown-10"></th>
          <th className="w-[100px] border border-black bg-brown-10">6/10</th>
          <th className="w-[100px] border border-black bg-brown-10">6/11</th>
          <th className="w-[100px] border border-black bg-brown-10">6/12</th>
          <th className="w-[100px] border border-black bg-brown-10">6/13</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="border border-black bg-brown-10">{row.time}</td>
            {row.attendanceCounts.map((attendanceCount) => (
              // eslint-disable-next-line react/jsx-key
              <td className="border border-black">{attendanceCount}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;
