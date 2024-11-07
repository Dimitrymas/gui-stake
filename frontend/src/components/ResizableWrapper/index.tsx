import React, {FC, useState, ReactNode} from 'react';
import styles from './index.module.css';

interface ResizableWrapperProps {
    defaultWidth: number;
    minWidth?: number; // Опциональная минимальная ширина
    maxWidth?: number; // Опциональная максимальная ширина
    onResize: (newWidth: number) => void;
    children: ReactNode;
}




export const ResizableWrapper: FC<ResizableWrapperProps> = ({ defaultWidth, minWidth, maxWidth, onResize, children }) => {
    const [width, setWidth] = useState(defaultWidth);


    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            let newWidth = startWidth + (moveEvent.clientX - startX);

            if (minWidth !== undefined) {
                newWidth = Math.max(newWidth, minWidth);
            }
            if (maxWidth !== undefined) {
                newWidth = Math.min(newWidth, maxWidth);
            }

            setWidth(newWidth);
            onResize(newWidth); // Вызываем функцию обратного вызова
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div style={{ width: `${width}px` }} className={styles.ResizableWrapper}>
            {children}
            <div
                className={styles.ResizableWrapperBorder}
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};