import { FC } from 'react';
import { HeaderProps } from '.';
import styles from './Header.module.scss';
import { Container } from '../Container';
import { Navbar } from '../Navbar';


export const Header: FC<HeaderProps> = () => {
	return (<header className={styles.header}>
		<Container className={styles.header__container}>
			<Navbar />
		</Container>
	</header>);
};
