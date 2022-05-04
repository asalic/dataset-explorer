import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';

import DatasetDetailsView from "./DatasetDetailsView";
import DatasetHistoryView from "./DatasetHistoryView";
import DatasetStudiesView from "./DatasetStudiesView";
import Message from "../model/Message.js";
import Breadcrumbs from "./Breadcrumbs";
import UnauthorizedView from "./UnauthorizedView";
import ResourceNotFoundView from "./ResourceNotFoundView";
import DatasetFieldEdit from "./DatasetFieldEdit";
import Util from "../Util";

function getAction(condition, actionCb, txt) {
  if (condition) {
    return <Dropdown.Item href="#"
            onClick={() => {
              actionCb();
            }}>{txt}</Dropdown.Item>
  } else {
    return <Fragment />;
  }
}

function getActions(token, data, patchDatasetCb) {
  if (data.editablePropertiesByTheUser.some(r => ["invalidated", "public", "draft"].includes(r))) {
    return  <DropdownButton title="Actions">
              {getAction(data.editablePropertiesByTheUser.includes("invalidated"),
                  () => {patchDatasetCb(token, data["id"], "invalidated", !data.invalidated)}, data.invalidated ? "Validate" : "Invalidate")}
              {getAction(data.editablePropertiesByTheUser.includes("public"),
                  () => {patchDatasetCb(token, data["id"], "public", !data.public)}, data.public ? "Make private" : "Make public")}
              {getAction(data.editablePropertiesByTheUser.includes("draft"),
                  () => {patchDatasetCb(token, data["id"], "draft", false)}, "Release")}
            </DropdownButton>
  }
  return <Fragment />
}



function DatasetView(props) {
   let location = useLocation();

    let params = useParams();
  let navigate = useNavigate();
  const datasetId = params.datasetId;//props.datasetId;
  const [allValues, setAllValues] = useState({
      isLoading: false,
       isLoaded: false,
       error: null,
       data: null,
       status: -1
    });

    let { keycloak } = useKeycloak();
    const getDataset = function(token, datasetId) {

      props.dataManager.getDataset(token, datasetId, 0, 0)
      .then(
        (xhr) => {
          let data = JSON.parse(xhr.response);
          console.log("[TMP] license set");
          if (data["license"] === null ||  data["license"] === undefined ||  data["license"].length === 0) {
            data["license"] = {title: "", url: ""};
          }
          if (data["licenseUrl"] !== null &&  data["licenseUrl"] !== undefined && data["licenseUrl"].length !== 0) {
            data["license"] = JSON.parse(data["licenseUrl"].replace(/'/g,"\""));//(typeof data["licenseUrl"] === "object" ? data["licenseUrl"] : JSON.parse(data["licenseUrl"])); //data["licenseUrl"].title;//JSON.parse(data["licenseUrl"]);
          }
          setAllValues( prevValues => {
             return { ...prevValues, isLoading: false, isLoaded: true, error: null, data: data, status: xhr.status }
          });
        },
        (xhr) => {
          const error = Util.getErrFromXhr(xhr);
          props.postMessage(new Message(Message.ERROR, error.title, error.text));
            setAllValues( prevValues => {
               return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: error, status: xhr.status}
            });
        });
      }
    const patchDataset = (token, datasetId, field, value) => {
      props.dataManager.patchDataset(token, datasetId, field, value)
      .then(
        (xhr) => {
          getDataset(token, datasetId);
          // setAllValues( prevValues => {
          //   let data = JSON.parse(JSON.stringify(prevValues));
          //   data[field] = value;
          //    return { ...prevValues, isLoading: false, isLoaded: true, error: null, data, status: xhr.status }
          // });
        },
        (xhr) => {
          const error = Util.getErrFromXhr(xhr);
          props.postMessage(new Message(Message.ERROR, error.title, error.text));
          // setAllValues( prevValues => {
          //    return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: Util.getErrFromXhr(xhr), status: xhr.status }
          // });
        });
      }

  useEffect(() => {
      if (props.keycloakReady) {
        getDataset(keycloak.token, datasetId);
      } else {
        getDataset(null, datasetId);
      }
    }, [props.keycloakReady]);
  if (allValues.data === null || allValues.isLoading) {
    return <div>loading...</div>
  }
  if (allValues.error !== null) {
    if (allValues.status === 401) {
      return <UnauthorizedView />
    } else if (allValues.status === 404) {
      return <ResourceNotFoundView id={datasetId} />;
    } else {
      return <div>Error</div>;
    }
  }
  return (
    <Fragment>
      <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
      <Row className="mb-4 mt-4">
        <Col md={8}>
          <h3 className="container-fluid">
              <b className="me-1">{allValues.data.name}
              {
                allValues.data.editablePropertiesByTheUser.includes("draft")
                ? <DatasetFieldEdit datasetId={datasetId} showDialog={props.showDialog} field="name" fieldDisplay="Dataset name" oldValue={allValues.data.name} patchDataset={patchDataset}/>
                : <Fragment />
              }
              </b>
              (
                <i>{allValues.data.id}</i>
                <Button variant="link" className="m-0 ms-1 p-0" onClick={() =>
                    {navigator.clipboard.writeText(allValues.data.id).then(function() {
                      console.log('Async: Copying to clipboard was successful!');
                    }, function(err) {
                      console.error('Async: Could not copy text: ', err);
                    });}} >
                  <ClipboardPlus />
                </Button>
              )
          </h3>
          <h3 className="container-fluid mb-0 ms-2" style={{fontSize: "1rem"}}>
            <i>Created on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                .format(Date.parse(allValues.data.creationDate))}
            </i>
            <span  className="container-fluid mb-0 ms-2" style={{fontSize: "1rem"}}>
              {( allValues.data.invalidated ? <Badge className="me-2" bg="secondary">Invalidated</Badge>: <Fragment /> )}
              {( allValues.data.public ? <Badge bg="dark">Public</Badge> : <Fragment /> )}
              {( allValues.data.draft ? <Badge bg="light" text="dark">Draft</Badge> : <Fragment /> )}
            </span>
          </h3>

        </Col>
        <Col md={4}>
          <div className="float-end">
            {getActions(keycloak.token, allValues.data, patchDataset)}
          </div>
        </Col>
      </Row>
      <Container fluid className="mt-0 mb-6">
        <b>Description:</b> {allValues.data.description}
        {
          allValues.data.editablePropertiesByTheUser.includes("description")
          ? <DatasetFieldEdit datasetId={datasetId} showDialog={props.showDialog} field="description" fieldDisplay="Dataset description" oldValue={allValues.data.description} patchDataset={patchDataset}/>
          : <Fragment />
        }
      </Container>
      <Container fluid className="">
        <Tabs defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
          <Tab eventKey="details" title="Details">
            <DatasetDetailsView patchDataset={patchDataset} showDialog={props.showDialog} allValues={allValues} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
          </Tab>
          <Tab eventKey="studies" title="Studies">
            <DatasetStudiesView datasetId={datasetId} studiesCount={allValues.data === null ? 0 : allValues.data.studiesCount} keycloakReady={props.keycloakReady}
              postMessage={props.postMessage} dataManager={props.dataManager}/>
          </Tab>
          {keycloak.authenticated ?
            (<Tab eventKey="history" title="History">
                <DatasetHistoryView datasetId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
              </Tab>) : (<Fragment />)}
        </Tabs>
      </Container>
    </Fragment>
  );
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_STUDIES = "studies";
DatasetView.TAB_HISTORY = "history";

export default DatasetView;
