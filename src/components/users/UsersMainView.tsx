import { useCallback, useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useKeycloak } from '@react-keycloak/web';

import DataManager from "../../api/DataManager";
import SearchComponent from "../common/SearchComponent";
import Util from "../../Util";
import config from "../../service/config";
import { useGetUsersPageQuery } from "../../service/singledata-api";
import FilteringView from "../data/common/main/filter/FilteringView";
import PaginationFooter from "../common/PaginationFooter";
import MainTable from "./MainTable";

function getSortDirectionDesc(searchParam?: string | null, sortBy?: string | null): string {
  if (!sortBy) {
    sortBy = "creationDate";
  }

  if (!searchParam) {
    switch (sortBy) {
      case "gid":
      case "email":
      case "name":
      case "username": searchParam = "ascending"; break;
      case "creationDate": searchParam =  "descending"; break;
      default: console.warn(`Column ${sortBy} not handled when sort dir not set`); searchParam =  "descending"; 
    }
  } 
  return searchParam;// === "ascending" ? false : true;
}

interface UsersMainViewProps {
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
    activeTab?: string;
  }
  
export default function UsersMainView(props: UsersMainViewProps) {
  let { keycloak } = useKeycloak();
  const [searchParams, setSearchParams] = useSearchParams("");
  
  const updSearchParams = useCallback((params: Object) => {
    Util.updSearchParams(params, searchParams, setSearchParams)
  }, [searchParams, setSearchParams]);

  const searchStringTmp: string | null = searchParams.get("searchString");
  const searchString: string = searchStringTmp ? decodeURIComponent(searchStringTmp) : "";
  const sortBy: string = searchParams.get("sortBy") ?? "creationDate";
  const sortDirection: string = getSortDirectionDesc(searchParams.get("sortDirection"), searchParams.get("sortBy") ?? "creationDate");

  const skip: number = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
  const limit: number = searchParams.get("limit") ? Number(searchParams.get("limit")) : config.defaultLimitUsers;

  const onSkipChange = useCallback((skip: number) => {
    updSearchParams({skip: skip === 0 ? null : skip});
  }, [searchString, skip, limit, updSearchParams, searchParams, setSearchParams]);

  const filterUpdate = useCallback((params: Object) => {
    updSearchParams({...params, skip: null})
  }, [skip, updSearchParams]);

  const searchStringUpdate = useCallback((searchString: string | null) => {
    updSearchParams({searchString, skip: null})
  }, [skip, updSearchParams]);

  useEffect(() => {
    if (searchParams.get("disabled") === null) {
      console.log("update");
      updSearchParams({disabled: "false"})
    }
  }, [searchParams, setSearchParams, updSearchParams]);
  const disabled = searchParams.get("disabled") === "" ? null : searchParams.get("disabled");
  const {data, isError, error, isLoading} = useGetUsersPageQuery({
      token: keycloak.token, 
      qParams: {
          skip, limit, searchString, sortBy, sortDirection,
          ...(searchParams.get("project") !== null) && {project: searchParams.get("project")},
          ...(searchParams.get("draft") !== null) && {draft: searchParams.get("draft")},
          ...(searchParams.get("public") !== null) && {public: searchParams.get("public")},
          ...(disabled !== null) && {disabled}
          //...(searchParams.get("disabled") !== null) && {disabled: searchParams.get("disabled")}                        
        }
    });

  return (
    <Container fluid>
      <div>
        <SearchComponent initValue={searchString} searchStringUpdate={searchStringUpdate} />
      </div>
      {
        isError ? 
          <Alert variant="danger">
            <Alert.Heading>Error loading data</Alert.Heading>
            {"message" in error ? error.message : error.data}
          </Alert>
        : <></>
      }
      <div style={{display: "flex", flexDirection: "row"}}>
        <div>
          <FilteringView filterUpdate={filterUpdate} searchParams={searchParams}  loading={isLoading} 
            keycloakReady={props.keycloakReady} dataManager={props.dataManager} postMessage={props.postMessage}
            flags={[
              // {name: "Draft", flag: "draft", backgroundVariant: "light", textColor: "dark", valueForRemove: null},
              // {name: "Published", flag: "public", backgroundVariant: "dark", textColor: "light", valueForRemove: null},
              {name: "Disabled", flag: "disabled", backgroundVariant: "secondary", textColor: "light", valueForRemove: ""}
            ]}/>
        </div>
        <div style={{flexGrow: "1"}}>
          <MainTable data={data && data?.list ? data.list.slice(0, limit) : []}
            dataManager={props.dataManager}
            postMessage={props.postMessage}
            updSearchParams={updSearchParams}
                currentSort={{
                  id: sortBy, 
                  desc: sortDirection === "descending" ? true : false
                }}
          />
          <div className="d-flex flex-row justify-content-center w-100" >
              <PaginationFooter skip={skip} limit={limit} total={data?.total ?? 0} onSkipChange={onSkipChange} />
          </div>
        </div>
      </div>
    </Container>
  );

}
