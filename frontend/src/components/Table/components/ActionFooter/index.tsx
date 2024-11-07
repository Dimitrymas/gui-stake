import {FC} from "react";
import styles from "./index.module.css"
import {TbTrash} from "react-icons/tb";

interface ActionFooterProps {
    onDelete: () => void,
}

export const ActionFooter: FC<ActionFooterProps> = ({onDelete}: ActionFooterProps) => {
    return (
        <div className={styles.ActionFooter}>
            <TbTrash className={styles.ActionFooterTrashIcon} onClick={onDelete}/>
        </div>
    )
}