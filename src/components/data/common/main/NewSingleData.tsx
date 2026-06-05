import { Button } from "react-bootstrap";
import React from "react";
import SingleDataType from "../../../../model/SingleDataType";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../../../service/UrlFactory";

interface NewSingleDataProps {
    singleDataType: SingleDataType;
    
}

export default function NewSingleData({ singleDataType }: NewSingleDataProps): JSX.Element {

    const navigate = useNavigate();

    const onNav = () => {
        switch (singleDataType) {
            case SingleDataType.DATASET: navigate(UrlFactory.datasetNew()); break;
            default: throw new Error(`Unhandled single data type '${singleDataType}'`);
        }
    }

    return <Button onClick={onNav}>New</Button>
}