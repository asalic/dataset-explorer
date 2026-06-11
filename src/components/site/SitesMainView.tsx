import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";
import SitesList from "./SitesList";
import SiteEditor from "./SiteEditor";
import MessageView from "../common/MessageView";
import Message from "../../model/Message";
import { useKeycloak } from "@react-keycloak/web";
import ErrorView from "../common/ErrorView";
import LoadingView from "../common/LoadingView";
import { useNavigate, useSearchParams } from "react-router-dom";
import UrlFactory from "../../service/UrlFactory";
import { useGetSitesQuery } from "../../service/site-api";
import Util from "../../Util";

const SELECTED_PARAM = "selected";

interface SitesMainViewProps {
    keycloakReady: boolean;

}

export default function SitesMainView({keycloakReady}: SitesMainViewProps): JSX.Element {
    const {keycloak} = useKeycloak();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams("");
    const selectedCode = searchParams.get(SELECTED_PARAM) === "" ? null : searchParams.get(SELECTED_PARAM);
     
    // const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const { data, error, isError, isLoading, isFetching } = useGetSitesQuery({
        token: keycloak.token
        },
        {
            skip: !keycloak.authenticated
        });

    const updSelectedCode = (newCode: string | null) => {
    //   setSelectedCode(newCode);
        if (newCode) {
            searchParams.set(SELECTED_PARAM, newCode);
        } else {
            searchParams.delete(SELECTED_PARAM);
        }
      setSearchParams(searchParams);
    }
    const onNew = useCallback(() => {
        navigate(UrlFactory.siteCreator());
    }, [navigate])
    if (isError) {
        return  <ErrorView message={Util.getError(error).message} />;
    } else if (isLoading || isFetching) {
        return <LoadingView what="sites" />
    } else if (data) {
        return <>
            {
                keycloakReady 
                    ? <>{
                        keycloak.authenticated 
                        ? <div>
                            <Button type="button" variant="primary" className="w-auto" onClick={onNew}>New</Button>
                            <Row className="mt-4">
                                <Col>
                                    <SitesList sites={data} updSelectedCode={updSelectedCode} selectedCode={selectedCode}/>
                                </Col>
                                <Col>
                                    {
                                        selectedCode ? <SiteEditor siteCode={selectedCode} />
                                            : <MessageView message={new Message(Message.INFO, "Select a site from the list")} />
                                    }
                                </Col>
                            </Row>
                        </div>
                        : <ErrorView message="Please authenticate to access this page" />

                    }</>
                    : <LoadingView what="page" />
            }
        </>;
    } else {
        return <MessageView message={new Message(Message.INFO, "No data available.")} />;
    }
}