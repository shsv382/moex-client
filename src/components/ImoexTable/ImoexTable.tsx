import { FC } from 'react';
import { ImoexTableProps } from '.';
import styles from './ImoexTable.module.scss';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PopupBody } from '../PopupBody';
import Checkbox from '@mui/material/Checkbox';
import { Stock } from '../../pages/Index/Index.types';
import { Link } from 'react-router-dom';

export const ImoexTable: FC<ImoexTableProps> = ({ data, addToPortfolio, removeFromPortfolio, makeNote }) => {
	const handleCheckboxToggle = (stock: Stock<boolean>) => () => {
		stock.includedToPortfolio ?
		removeFromPortfolio(stock.ticker) :
		addToPortfolio(stock.ticker)
	}

	return (
		<TableContainer component={Paper}>
		  <Table sx={{ minWidth: 650 }} aria-label="simple table">
			<TableHead className={styles.table__head}>
			  <TableRow>
			  	<TableCell>В портфеле</TableCell>
				<TableCell>Тикер</TableCell>
				<TableCell>Название</TableCell>
				<TableCell align="center" className={styles.withPopup}>
				  Таргет (факт)
				  <PopupBody className={styles.popup}>Сколько акций/лотов должно быть в портфеле</PopupBody>
				</TableCell>
				<TableCell align="center">Факт</TableCell>
				<TableCell align="right">Вес в индексе</TableCell>
				<TableCell align="right">Цена</TableCell>
				<TableCell align="right">Объем лота</TableCell>
				<TableCell align="right" className={styles.withPopup}>
				  Таргет акций
				  <PopupBody className={styles.popup}>Сколько акций должно быть в портфеле</PopupBody>
				</TableCell>
			  </TableRow>
			</TableHead>
			<TableBody>
			  {data.filter(stock => stock.includedToPortfolio).map((stock: any) => (
				
				<TableRow
					key={stock.ticker}
					className={stock.includedToPortfolio && styles.table__portfolio}
					sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
				>
				
					<TableCell component="th" scope="row">
						<Checkbox checked={stock.includedToPortfolio} onChange={handleCheckboxToggle(stock)} />
					</TableCell>
					<TableCell component="th" scope="row">
						<Link to={`https://smart-lab.ru/q/${stock.ticker}/f/y/`} target='_blank'>
							{stock.ticker}
						</Link>
					</TableCell>
					<TableCell>{stock.shortnames}</TableCell>
					<TableCell align="center">{stock.finalTarget} шт. / {stock.lotsTarget} лт.</TableCell>
					<TableCell align="center">
						<input 
						type="text" 
						name="" 
						id="" 
						className={styles.table__note}
						onChange={(e) => makeNote(stock.ticker, e.target.value)}
						/>
					</TableCell>
					<TableCell align="right">{stock.weight} %</TableCell>
					<TableCell align="right">{stock.marketPrice} &#x20bd;</TableCell>
					<TableCell align="right">{stock.lotSize} шт.</TableCell>
					<TableCell align="right">{stock.countTarget} шт.</TableCell>
				</TableRow>
			  ))}
			  	{data.filter(stock => !stock.includedToPortfolio).map((stock: any) => (
				
				<TableRow
					key={stock.ticker}
					className={stock.includedToPortfolio && styles.table__portfolio}
					sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
				>
				
					<TableCell component="th" scope="row">
						<Checkbox checked={stock.includedToPortfolio} onChange={handleCheckboxToggle(stock)} />
					</TableCell>
					<TableCell component="th" scope="row">
						<Link to={`https://smart-lab.ru/q/${stock.ticker}/f/y/`} target='_blank'>
							{stock.ticker}
						</Link>
					</TableCell>
					<TableCell>{stock.shortnames}</TableCell>
					<TableCell align="center">{stock.finalTarget} шт. / {stock.lotsTarget} лт.</TableCell>
					<TableCell align="right">{stock.weight} %</TableCell>
					<TableCell align="right">{stock.marketPrice} &#x20bd;</TableCell>
					<TableCell align="right">{stock.lotSize} шт.</TableCell>
					<TableCell align="right">{stock.countTarget} шт.</TableCell>
				</TableRow>
			  ))}
			</TableBody>
		  </Table>
		</TableContainer>
	);
}