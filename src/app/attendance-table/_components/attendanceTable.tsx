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
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="w-2"></TableCell>
            <TableCell className="w-2">6/10</TableCell>
            <TableCell className="w-2">6/11</TableCell>
            <TableCell className="w-2">6/12</TableCell>
            <TableCell className="w-2">6/13</TableCell>
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
