import { FC } from 'react';
import { NavbarProps } from '.';
import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';

export const Navbar: FC<NavbarProps> = (props) => {
	return (
		<nav className={styles.navbar}>
			<Link to={`/`}>На главную</Link>
			<Link target='_blank' to={`https://smart-lab.ru/q/shares_fundamental4`}>Фундаментальный анализ акций</Link>
		</nav>
	);
};
