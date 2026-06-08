import { Button } from "react-bootstrap";
import React from "react";
import SingleDataType from "../../../../model/SingleDataType";
import { useNavigate } from "react-router-dom";
import DialogSize from "../../../../model/DialogSize";
import config from "../../../../service/config";
import UrlFactory from "../../../../service/UrlFactory";
import Dialog from "../../../common/Dialog";

interface NewSingleDataProps {
    singleDataType: SingleDataType;
    showDialog: Function;

}

export default function NewSingleData({ singleDataType, showDialog }: NewSingleDataProps): JSX.Element {

    const navigate = useNavigate();

    const explorerLink = config.caseExplorer?.link;

    const onNav = () => {
        // switch (singleDataType) {
        //     case SingleDataType.DATASET: navigate(UrlFactory.datasetNew()); break;
        //     default: throw new Error(`Unhandled single data type '${singleDataType}'`);
        // }
        if (singleDataType === SingleDataType.DATASET) {
            showDialog({
                show: true,
                footer: <></>,
                body: <div className="d-flex flex-column gap-2 mx-4">
                    {
                        explorerLink != null ?
                            <>
                                <Button variant="primary" onClick={() => {Dialog.HANDLE_CLOSE(); window.open(explorerLink, '_blank', 'noopener,noreferrer');}}>
                                    via Case Explorer<br />(creating from scratch)
                                </Button>
                                <div className="d-flex align-items-center w-100 my-4">
                                    <div className="flex-grow-1 border-top border-secondary"></div>
                                    <span className="mx-3 text-muted">OR</span>
                                    <div className="flex-grow-1 border-top border-secondary"></div>
                                </div>
                            </>
                            : null
                    }

                    <Button variant="primary" onClick={() => {navigate(UrlFactory.datasetNew()); Dialog.HANDLE_CLOSE();}}>
                        via Dataset Explorer<br />(creating based on existing dataset)
                    </Button>
                </div>,
                title: <span>Create a new dataset</span>,
                size: DialogSize.SIZE_SM,
                onBeforeClose: null
            });

        }
    }

    return <Button onClick={onNav}>New</Button>
}