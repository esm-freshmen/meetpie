import { tv } from 'tailwind-variants';

const thStyle = tv({
  base: 'w-[100px] border border-black bg-brown-10',
});
const tdStyle = tv({
  base: 'border border-black bg-brown-10',
  variants: {
    bgColor: {
      column: 'bg-brown-10',
      field: '',
    },
  },
});

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
    <table className='text-center'>
      <thead>
        <tr>
          <th className={thStyle()}></th>
          <th className={thStyle()}>6/11</th>
          <th className={thStyle()}>6/12</th>
          <th className={thStyle()}>6/13</th>
          <th className={thStyle()}>6/14</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td key={row.id} className={tdStyle({ bgColor: 'column' })}>
              {row.time}
            </td>
            {row.attendanceCounts.map((attendanceCount) => (
              // eslint-disable-next-line react/jsx-key
              <td className={tdStyle({ bgColor: 'field' })}>
                {attendanceCount}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;
