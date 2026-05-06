
import React from "react";
import { Badge, Button } from "react-bootstrap";
import styles from "./TagComponent.module.css";
import { useNavigate } from "react-router-dom";

interface TagComponentProps {
    className?: string;
    text: string;
    isClickable?: boolean | null | undefined;
}

export default function TagComponent({text, isClickable, className}: TagComponentProps): JSX.Element {
    const navigate = useNavigate();
    const onClick = () => {
        if (isClickable) {
            navigate(`/datasets/?tag=${text}`);
        }
    }
    return <Badge title={`Tag "${text}"`} bg="light" text="dark" className={`p-0 px-1 ${className ?? ""}`}>
        <Button variant="link" onClick={onClick} 
            className={`${styles["link"]}`}><span className={styles["text"]}>{`#${text}`}</span></Button>
    </Badge>;

}