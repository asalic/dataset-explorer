import { Fragment, useMemo } from "react";
import { Row, Col, Container } from "react-bootstrap";
import DataManager from "../../../api/DataManager";
import type SingleItemTab from "../../../model/SingleItemTab";
import { useKeycloak } from "@react-keycloak/web";
import Util from "../../../Util";
import { useParams } from "react-router-dom";
//import LoadingError from "../../../../model/LoadingError";
import ResourceNotFoundView from "../../common/ResourceNotFoundView";
import { useGetUserQuery } from "../../../service/api/users-api";
import LoadingView from "../../common/LoadingView";
import ErrorView from "../../common/ErrorView";
import Breadcrumbs from "../../common/Breadcrumbs";
import TabsView from "../../common/TabsView";
import UrlFactory from "../../../service/UrlFactory";
import UserDetailsView from "./UserDetailsView";
import UserLogsView from "./UserLogsView";

UserView.TAB_DETAILS = "details";
UserView.TAB_LOGS = "logs";

interface UserViewProps {
    dataManager: DataManager;
    postMessage: Function;
    showDialog: Function;
    keycloakReady: boolean;
    activeTab: string;
}

export default function UserView(props: UserViewProps) {
  const { keycloak } = useKeycloak();
  const params = useParams();
  const username: string = params["username"] ?? "";

  const { data: user, isLoading, isError, error } = useGetUserQuery({
      token: keycloak.token,
      username: username
    },{
      skip: !(props.keycloakReady && username)
    }
  )

  const tabs: SingleItemTab[] = useMemo(() => {
    const result: SingleItemTab[] = [{
        eventKey: UserView.TAB_DETAILS,
        title: "Details",
        view: <UserDetailsView showDialog={props.showDialog} keycloakReady={props.keycloakReady} username={username}/>
      },
      {
        eventKey: UserView.TAB_LOGS,
        title: "Logs",
        view: <UserLogsView showDialog={props.showDialog} keycloakReady={props.keycloakReady} username={username}/>
      }
    ]
    return result;
  }, [keycloak.authenticated, props])

  if (username === "") {
    console.error("Username cannot be empty");
    return <ResourceNotFoundView id={"<username_empty_string>"} />;
  } else if (isLoading || !props.keycloakReady) {
      return <LoadingView what={`username '${username}'`} />;
  } else if (isError) {
      return <ErrorView message={`Error loading details of username '${username}': ${Util.getError(error).message}`} />;
  } else {
    return (
      <Fragment>
        <Breadcrumbs elems={[{text: 'User information', link: "", active: true}]}/>
        <Row className="mb-4 mt-4">
          <Col md={11}>
            <span className="h3">
              <b className="me-1">{user?.username}</b>
            </span>
          </Col>
          <Col md={1}>
            <div className="float-end">
              {/* <SingleDataActions singleDataId={singleDataId} singleDataType={props.singleDataType} 
                  showDialog={props.showDialog} keycloakReady={props.keycloakReady} /> */}
            </div>
          </Col>
        </Row>
        <Container fluid className="w-100 flex-grow-1 d-flex flex-column">
          <TabsView basePath={UrlFactory.userBase(username)} tabs={tabs} defaultTab={UserView.TAB_DETAILS} activeTab={props.activeTab} />
        </Container>
      </Fragment>
        );
  }

}
