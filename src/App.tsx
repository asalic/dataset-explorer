
import React, { useState, useCallback } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import DatasetView from "./components/data/datasets/dataset/DatasetView";
import DataManager from "./api/DataManager";
import MessageView from "./components/common/MessageView";
import Dialog from "./components/common/Dialog";
import NavbarView from "./components/common/NavbarView";
import Footer from "./components/common/Footer";
import config from "./service/config";
import FairView from "./components/FairView";
import SupportView from "./components/SupportView";
import Message from "./model/Message";
import type DialogSettings from "./model/DialogSettings";
import DialogSize from "./model/DialogSize";
import DatasetsMainView from "./components/data/datasets/DatasetsMainView";
import SingleDataView from "./components/data/common/single/main/SingleDataView";
import ModelsMainView from "./components/data/models/ModelsMainView";
import ProjectsMainView from "./components/project/MainView";
import ProjectDetailsView from "./components/project/DetailsView";
import UrlFactory from "./service/UrlFactory";
import NewProjectView from "./components/project/NewProjectView";
import ConfigEditorView from "./components/project/ConfigEditorView";
import UsersMainView from "./components/users/UsersMainView";
import UserView from "./components/users/user/UserView";
import SubprojectEditor from "./components/project/subproject/SubprojectEditor";
import SitesMainView from "./components/site/SitesMainView";
import SiteCreatorView from "./components/site/SiteCreatorView";
import NewDataset from "./components/data/datasets/dataset/NewDataset";

interface Dsv {
    tab: string;
    sdo: string;
    dataManager: DataManager;
    keycloakReady: boolean;
    postMessage: Function;
    showDialog: Function;
}

const dlgDefaultValues: DialogSettings = {
    show: false,
    footer: <Button onClick={() => Dialog.HANDLE_CLOSE()}>Close</Button>,
    title: <>"DEFAULT"</>,
    body: <div>Empty body</div>,
    size: DialogSize.SIZE_LG,
    onBeforeClose: null,
    //data: null,
    scrollable: false
};

function getDSV({ tab, sdo, dataManager, keycloakReady, postMessage, showDialog }: Dsv) {
    return (
        <DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
            postMessage={postMessage} dataManager={dataManager} activeTab={tab} showdDlgOpt={sdo} />
    );
}

interface AppProps {
    keycloakReady: boolean;
}

function App({ keycloakReady }: AppProps) {
    const [dlgState, setDlgState] = useState<DialogSettings>(dlgDefaultValues);
    //const handleClose = useCallback(() => Dialog.HANDLE_CLOSE());
    const [dataManager] = useState(new DataManager());
    const [message, setMessage] = useState<Message | null>(null);
    const postMessage = useCallback((message: Message | null) => {
        console.log(message);
        setMessage(message);
    }, [setMessage]);
    const showDialog = (dlgProps: DialogSettings) => {
        setDlgState({
            ...dlgState,
            show: true,
            footer: dlgProps.footer,
            body: dlgProps.body,
            title: dlgProps.title,
            size: dlgProps.size,
            onBeforeClose: dlgProps.onBeforeClose
        });
    };
    let opt = {
        dataManager,
        keycloakReady: keycloakReady,
        postMessage,
        showDialog,
        sdo: null,
        tab: null
    }

    return (
        <BrowserRouter basename={config.basename}>
            <MessageView message={message} />
            <NavbarView />
            <div className="flex-grow-1 d-flex flex-column align-items-stretch ms-3 me-3 pt-3">
                <Dialog settings={dlgState} />
                <Routes>
                    <Route path="/" element={<Navigate to="/datasets" replace />} />
                    <Route path="/fair" element={<FairView />} />
                    <Route path="/support" element={<SupportView />} />
                    <Route path="/models" element={<ModelsMainView keycloakReady={keycloakReady}
                        dataManager={dataManager} postMessage={postMessage} />} />
                    <Route path="/datasets" element={<DatasetsMainView keycloakReady={keycloakReady}
                        dataManager={dataManager} postMessage={postMessage} />} />
                    <Route path={UrlFactory.datasetNew()} element={<NewDataset keycloakReady={keycloakReady} />} />
                    <Route path="/datasets/:singleDataId/details"
                        element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_DETAILS} />} />
                    <Route path="/datasets/:singleDataId/details/dlg-app-dashboard"
                        element={getDSV({ ...opt, tab: SingleDataView.TAB_DETAILS, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />
                    <Route path="/datasets/:singleDataId/studies"
                        element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_STUDIES} />} />
                    <Route path="/datasets/:singleDataId/studies/dlg-app-dashboard"
                        element={getDSV({ ...opt, tab: DatasetView.TAB_STUDIES, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path="/datasets/:singleDataId/history"
                        element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_HISTORY} />} />
                    <Route path="/datasets/:singleDataId/history/dlg-app-dashboard"
                        element={getDSV({ ...opt, tab: SingleDataView.TAB_HISTORY, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path="/datasets/:singleDataId/access"
                        element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_ACCESS_HISTORY} />} />
                    <Route path="/datasets/:singleDataId/access/dlg-app-dashboard"
                        element={getDSV({ ...opt, tab: SingleDataView.TAB_HISTORY, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path="/datasets/:singleDataId/acl"
                        element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_ACL} />} />
                    <Route path="/datasets/:singleDataId/acl/dlg-app-dashboard"
                        element={getDSV({ ...opt, tab: SingleDataView.TAB_ACL, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path={UrlFactory.projectNew()} element={<NewProjectView postMessage={postMessage}/>} />
                    <Route path="/projects" element={<ProjectsMainView keycloakReady={keycloakReady} />} />
                    <Route path="/projects/:code/details" element={<ProjectDetailsView showDialog={showDialog} keycloakReady={keycloakReady} />} />
                    <Route path="/projects/:code/config-editor" element={<ConfigEditorView />} />
                    <Route path="/projects/:code/subprojects/:subcode/editor" element={<SubprojectEditor />} />
                    <Route path="/projects/:code/subprojects/new" element={<SubprojectEditor />} />

                    <Route path="/sites" element={<SitesMainView keycloakReady={keycloakReady} />} />
                    <Route path="/sites/creator" element={<SiteCreatorView keycloakReady={keycloakReady} />} />

                    <Route path="/users" element={<UsersMainView keycloakReady={keycloakReady}
                        dataManager={dataManager} postMessage={postMessage} />} />
                    <Route path={`/users/:username/${UserView.TAB_DETAILS}`}
                        element={<UserView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={UserView.TAB_DETAILS} />} />
                    <Route path={`/users/:username/${UserView.TAB_LOGS}`}
                        element={<UserView showDialog={showDialog} keycloakReady={keycloakReady}
                            postMessage={postMessage} dataManager={dataManager} activeTab={UserView.TAB_LOGS} />} />

                    <Route path="*" element={
                        <main style={{ padding: "1rem" }}>
                            <p>There is nothing here!</p>
                        </main>
                    }
                    />
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
