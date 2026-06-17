import { useKeycloak } from "@react-keycloak/web";
import { ListGroup } from "react-bootstrap";
import UserAdd from "./UserAdd";
import UserList from "./UserList";
import SingleDataType from "../../../../../model/SingleDataType";
import { useGetSingleDataQuery } from "../../../../../service/api/singledata-api";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import type SingleData from "../../../../../model/SingleData";

interface AccessControlListViewProps {
    keycloakReady: boolean;
    singleDataId: string;
    singleDataType: SingleDataType
}

function getWhoCanSee(dataset: SingleData): JSX.Element {
  let msg = <></>;
  if (dataset.draft) {
    msg = <><b>draft</b> dataset is visible only to its creator.</>;
  } else if (dataset.public === false) {
    msg = <><b>released</b> dataset is visible only to registered users that are also part of the dataset's project.</>;
  } else {
    msg = <><b>public</b> dataset is visible to anyone (even unregistered users).</>;
  }
  return <>The <b>metadata</b> of a {msg}</>;
}

function getWhoCanUse(dataset: SingleData): JSX.Element {
  let msg = <></>;
  if (dataset.draft) {
    msg =  <><b>draft</b> dataset can be accessed only by its creator.</>
  } else if (dataset.public === false) {
    msg =  <><b>released</b> dataset can be accessed only by registered users that are also part of the dataset's project.</>
  } else {
    msg =  <><b>public</b> dataset can be accessed by registered users that either have joined the dataset's project or added to the dataset's ACL.</>
  }
  return <>The <b>contents</b> of a {msg}</>;
}


export default function AccessControlListView({singleDataId, keycloakReady, singleDataType}: AccessControlListViewProps) {
    let { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetSingleDataQuery({
        token: keycloak.token,
        id: singleDataId,
        singleDataType
      },
      {
        skip: !(keycloakReady && singleDataId)
      }
    )

    if (isLoading) {
      return <LoadingView what="data" />;
    } else if (isError) {
      return <ErrorView message={`Error loading data: ${"message" in error ? error.message : JSON.stringify(error) }`} />
    } else {
      return <div className="limited-width-form">
        {
          data ? 
            <>
              <p  className="mb-4">
                <h4>Who can see</h4>
                <ListGroup className="ms-4 me-4">
                  <ListGroup.Item variant="info">
                    { getWhoCanSee(data) }
                  </ListGroup.Item>
                </ListGroup>
              </p>
              <p  className="mb-4">
                <h4>Who can use</h4>
                <ListGroup className="ms-4 me-4">
                  <ListGroup.Item variant="info">
                    { getWhoCanUse(data) }
                  </ListGroup.Item>
                </ListGroup>
              </p>
            </>
            : <></>
        }
        <p>
          <h4>Access Control List (ACL)</h4>
          Other users that will be able to use the dataset apart from those have joined the project.<br />
          { data?.public ? <></> : <span>This is effective only when the dataset is public (<b>currently it is not</b>).</span> }

          <div className="ms-4 me-4">
            <UserAdd singleDataId={singleDataId} singleDataType={singleDataType} keycloakReady={keycloakReady}></UserAdd>
            <UserList singleDataId={singleDataId} singleDataType={singleDataType} keycloakReady={keycloakReady} />
          </div>
        </p>
      </div>;
    }

}