import styles from './index.module.css';


interface MessageProps {
    message: string
}

export const Message = ({message}: MessageProps) => {
    return (
        <span className={styles.Message}>{message}</span>
    );
}