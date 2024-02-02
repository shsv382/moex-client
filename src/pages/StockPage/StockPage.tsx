import { FC } from 'react';
import { StockPageProps } from '.';
import styles from './StockPage.module.scss';

export const StockPage: FC<StockPageProps> = (props) => {
	return (<div {...props}>
		Stock page
	</div>);
};
