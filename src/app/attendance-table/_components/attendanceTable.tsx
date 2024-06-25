import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="w-4/5">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>6/10</TableCell>
            <TableCell>6/11</TableCell>
            <TableCell>6/12</TableCell>
            <TableCell>6/13</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.time}>
              <TableCell key={row.time}>{row.time}</TableCell>
              {row.attendanceCounts.map((attendanceCount) => (
                <TableCell key={attendanceCount}>{attendanceCount}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;
