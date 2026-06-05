import React from "react";
import { Alert } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";


interface MultiMessageBoxProps {
    messages?: string[];
    variant: Variant;
}

export default function MultiMessageBox({messages, variant}: MultiMessageBoxProps): JSX.Element {

    if (messages?.length) {
        return <Alert variant={variant}>
            <ul>
                {
                    messages.map((v, idx) => <li key={idx}>{v}</li>)
                }
            </ul>
        </Alert>
    } 
    return <></>;
}