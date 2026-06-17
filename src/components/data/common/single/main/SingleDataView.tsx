import {Row, Col, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import type SingleData from "../../../../../model/SingleData";
import type SingleItemTab from "../../../../../model/SingleItemTab";
import Breadcrumbs from "../../../../common/Breadcrumbs";
import SingleDataTitle from "./SingleDataTitle";
import SingleDataActions from "./SingleDataActions";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import SingleDataType from "../../../../../model/SingleDataType";
import { useDeleteSingleDataCreatingMutation, useGetSingleDataQuery, 
         usePostSingleDataRestartCreationMutation, usePostSingleDataReadjustFilePermissionsMutation, 
         usePostSingleDataRecollectMetadataMutation, usePostSingleDataCheckIntegrityMutation } 
         from "../../../../../service/api/singledata-api";
import Util from "../../../../../Util";
import type CheckIntegrity from "../../../../../model/CheckIntegrity";
import DelCancelSingleDataMsg from "../../../../common/DelCancelSingleDataMsg";
import TabsView from "../../../../common/TabsView";
import SingleDataTags from "./SingleDataTags";
import UrlFactory from "../../../../../service/UrlFactory";



SingleDataView.TAB_DETAILS = "details";
SingleDataView.TAB_HISTORY = "history";
SingleDataView.TAB_ACCESS_HISTORY = "access";
SingleDataView.TAB_ACL = "acl";
//SingleDataView.TAB_DASHBOARD = "dashboard";

SingleDataView.SHOW_DLG_APP_DASHBOARD = "dlg-app-dashboard"

// const routeRoot = "/datasets/:datasetId";

// const routesTabs = {
//   [`${routeRoot}/${SingleDataView.TAB_DETAILS}`]: SingleDataView.TAB_DETAILS,
//   [`${routeRoot}/${SingleDataView.TAB_STUDIES}`]: SingleDataView.TAB_STUDIES,
//   [`${routeRoot}/${SingleDataView.TAB_HISTORY}`]: SingleDataView.TAB_HISTORY,
//   [`${routeRoot}/${SingleDataView.TAB_ACCESS_HISTORY}`]: SingleDataView.TAB_ACCESS_HISTORY,
  
// }

// function triggerFocus(element) {
//     var eventType = "onfocusin" in element ? "focusin" : "focus",
//         bubbles = "onfocusin" in element,
//         event;

//     if ("createEvent" in document) {
//         event = document.createEvent("Event");
//         event.initEvent(eventType, bubbles, true);
//     }
//     else if ("Event" in window) {
//         event = new Event(eventType, { bubbles: bubbles, cancelable: true });
//     }

//     element.focus();
//     element.dispatchEvent(event);
// }

interface ActionMessageT {
  action: string;
  error: any;
  data: boolean | undefined;
  updating: boolean;
}
function ActionMessage({action, error, data, updating}: ActionMessageT): JSX.Element {
  if (error) {
    return <ErrorView message={`Error ${action}: ${error.message}`} />
  } else if (updating) {
    return <></>; 
  } else if (data) {
      return <Alert variant="success" dismissible={true}>
                <Alert.Heading> Successfully started {action} </Alert.Heading>
             </Alert>
  } else { return <></>; }
}

interface IntegrityMessageT {
  integrityError: any;
  integrityData: CheckIntegrity | undefined;
  integrityUpdating: boolean;
}
function IntegrityMessage({integrityError, integrityData, integrityUpdating}: IntegrityMessageT): JSX.Element {
  if (integrityError) {
    return <ErrorView message={`Error checking integrity: ${integrityError.message}`} />
  } else if (integrityUpdating) {
    return <></>; 
  } else if (integrityData) {
    if (integrityData.success) {
      return <Alert variant="success" dismissible={true}>
        <Alert.Heading> Integrity check process started successfully </Alert.Heading>
        {integrityData.msg}
      </Alert>
    } else {
      return <Alert variant="danger" dismissible={true}>
        <Alert.Heading> Error starting the integrity check process </Alert.Heading>
        {integrityData.msg}
      </Alert>
    }
  } else { return <></>; }
}



interface SingleDataViewProps {
  singleDataType: SingleDataType;
  showDialog: Function;
  keycloakReady: boolean;
  showdDlgOpt?: string | null | undefined;
  activeTab: string;
  tabs: SingleItemTab[];
}

function SingleDataView<T extends SingleData>(props: SingleDataViewProps): JSX.Element {

  // const path: string | null | undefined = matchPath( location.pathname, routesTabs )?.path;

    let params = useParams();
  let navigate = useNavigate();
  const { keycloak } = useKeycloak();
  //const [activeTab, setActivetab] = useState<string>(props.activeTab);
  const singleDataId: string = params["singleDataId"] ?? "";//props.datasetId;

  const [ , { error: restartCreationError, data: restartCreationData, isLoading: restartCreationUpdating }] = usePostSingleDataRestartCreationMutation({
    fixedCacheKey: "postSingleDataRestartCreation"
  });
  const [ , { error: readjustPermissionsError, data: readjustPermissionsData, isLoading: readjustPermissionsUpdating }] = usePostSingleDataReadjustFilePermissionsMutation({
    fixedCacheKey: "postSingleDataReadjustFilePermissions"
  });
  const [ , { error: recollectMetadataError, data: recollectMetadataData, isLoading: recollectMetadataUpdating }] = usePostSingleDataRecollectMetadataMutation({
    fixedCacheKey: "postSingleDataRecollectMetadata"
  });
  const [ , { error: integrityError, data: integrityData, isLoading: integrityUpdating }] = usePostSingleDataCheckIntegrityMutation({
    fixedCacheKey: "postSingleDataCheckIntegrity"
  });
  const [ , { error: deleteError, isLoading: deleteIsLoading, data: deleteData } ] = useDeleteSingleDataCreatingMutation({
    fixedCacheKey: "deleteSingleDataCreating"
  });

  const { isLoading, error: singleDataError } = useGetSingleDataQuery({
      token: keycloak.token,
      id: singleDataId,
      singleDataType: props.singleDataType
    },
    {
        skip: !props.keycloakReady
    }
  )

  useEffect(() => {
    if (deleteIsLoading === false && (deleteError === undefined || deleteError === null) && deleteData) {
      navigate(UrlFactory.base());
    } 
  }, [deleteIsLoading, deleteError, deleteData ])


    // const handlePostMsg = useCallback((msgType, title, text) => {
    //   props.postMessage(new Message(msgType, title, text));
    // }, []);
  if (singleDataId) {
    if (singleDataError) {
        return <ErrorView message={`Error loading resource ID '${singleDataId}': ${singleDataError.message ?? ""}`} />
    } else if (isLoading) {
      return <LoadingView what={`details for resource ID '${singleDataId}'`} />;
    } else {
      return (
        <div className="mb-4">
          <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
          <Row className="mb-2 mt-4">
            <Col md={11}>
              <SingleDataTitle showDialog={props.showDialog} 
                keycloakReady={props.keycloakReady} singleDataId={singleDataId} singleDataType={props.singleDataType} />
            </Col>
            <Col md={1}>
              <div className="float-end">
                <SingleDataActions singleDataId={singleDataId} singleDataType={props.singleDataType} 
                    showDialog={props.showDialog} keycloakReady={props.keycloakReady} />
              </div>
            </Col>
          </Row>
          <Row className="mb-4 mt-2">
            <SingleDataTags showDialog={props.showDialog} 
                keycloakReady={props.keycloakReady} singleDataId={singleDataId} singleDataType={props.singleDataType} />
          </Row>
          <Container fluid className="w-100 h-75">
            <DelCancelSingleDataMsg deleteError={deleteError} />
            <ActionMessage action="restarting creation" error={restartCreationError} data={restartCreationData} updating={restartCreationUpdating} />
            <ActionMessage action="readjusting file permissions" error={readjustPermissionsError} data={readjustPermissionsData} updating={readjustPermissionsUpdating} />
            <ActionMessage action="recollecting metadata" error={recollectMetadataError} data={recollectMetadataData} updating={recollectMetadataUpdating} />
            <IntegrityMessage integrityError={integrityError} integrityData={integrityData} integrityUpdating={integrityUpdating} />
            <TabsView basePath={`/${Util.singleDataPath(props.singleDataType)}/${singleDataId}`} 
                      tabs={props.tabs} defaultTab="details" activeTab={props.activeTab} />
          </Container>
        </div>
          );
    }
  } else {
    if (isLoading || !props.keycloakReady) {
      return <LoadingView what={`resource ID '${singleDataId}'`} />;
    } else {    
      return <div>No dataset ID specified</div>; 
    }
  }

      
}
export default SingleDataView;
