
import React from "react";
import TagComponent from "./TagComponent";
import { Button } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";

interface DeletableTagComponentProps {
    text: string;
    onDelete: Function;
    isClickable?: boolean | null | undefined;
}

export default function DeletableTagComponent({text, onDelete, isClickable}: DeletableTagComponentProps): JSX.Element {

    return <div className="d-flex flex-row bg-light" style={{ width: "fit-content"}}>
        <TagComponent text={text} isClickable={isClickable}/>
        <Button size="sm" onClick={() => onDelete()}variant="link" className="ps-0 pt-0 mt-0 fw-bold" 
                title={`Remove tag '${text}'`}>
            <XCircleFill pointerEvents="none" className="text-danger" 
                />
        </Button>
    </div>
}