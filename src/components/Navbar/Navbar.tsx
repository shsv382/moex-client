import { FC } from 'react';
import { NavbarProps } from '.';
import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';

export const Navbar: FC<NavbarProps> = (props) => {
	return (
		<nav className={styles.navbar}>
			<Link to={`/`}>Index</Link>
			<Link to={`/roadmap`}>Roadmap</Link>
		</nav>
	);
};
