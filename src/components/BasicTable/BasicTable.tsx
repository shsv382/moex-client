import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './BasicTable.module.scss';
import { PopupBody } from '../PopupBody';

export default function BasicTable({ data }: { data: any[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className={styles.table__head}>
          <TableRow>
            <TableCell>Тикер</TableCell>
            <TableCell>Название</TableCell>
            <TableCell align="right">Вес в индексе</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Объем лота</TableCell>
            <TableCell align="right" className={styles.withPopup}>
              Таргет акций
              <PopupBody className={styles.popup}>Сколько акций должно быть в портфеле</PopupBody>
            </TableCell>
            <TableCell align="right" className={styles.withPopup}>
              Таргет лотов
              <PopupBody className={styles.popup}>Сколько лотов должно быть в портфеле</PopupBody>
            </TableCell>
            <TableCell align="right" className={styles.withPopup}>
              Таргет акций (факт)
              <PopupBody className={styles.popup}>Сколько акций должно быть в портфеле (по факту)</PopupBody>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.ticker}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row">
					{row.ticker}
				</TableCell>
				<TableCell>{row.shortnames}</TableCell>
				<TableCell align="right">{row.weight} %</TableCell>
				<TableCell align="right">{row.marketPrice} &#x20bd;</TableCell>
				<TableCell align="right">{row.lotSize} шт.</TableCell>
				<TableCell align="right">{row.countTarget} шт.</TableCell>
				<TableCell align="right">{row.lotsTarget} шт.</TableCell>
				<TableCell align="right">{row.finalTarget} шт.</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}