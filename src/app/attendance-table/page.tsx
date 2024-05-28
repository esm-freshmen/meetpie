import styles from './page.module.css';

export default function Page() {
  return (
    <div>
      <h1 className={styles.h1}>若手交流会</h1>
      <div>ここに説明が入ります</div>
      <br />
      <table className={styles.table}>
        <thead>
          <tr>
            <td className={styles.td}></td>
            <td className={styles.td}>12/14</td>
            <td className={styles.td}>12/11</td>
            <td className={styles.td}>12/12</td>
            <td className={styles.td}>12/13</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10:00</td>
            <td>1人</td>
            <td>4人</td>
            <td>1人</td>
            <td>2人</td>
          </tr>
          <tr>
            <td>11:00</td>
            <td>4人</td>
            <td>5人</td>
            <td>2人</td>
            <td>1人</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
