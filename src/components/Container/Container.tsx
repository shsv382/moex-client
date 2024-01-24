import { FC } from 'react';
import { ContainerProps } from '.';
import styles from './Container.module.scss';


export const Container: FC<ContainerProps> = ({ children, className }) => {
	return <div className={[styles.container, className].join(" ")}>{children}</div>;
};
