import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import ProjectAllowedActions from "../../../model/project/ProjectAllowedActions";
import { FilePlusFill } from "react-bootstrap-icons";
import { Col, Button } from "react-bootstrap";
import UrlFactory from "../../../service/UrlFactory";
import { useGetSubprojectsQuery } from "../../../service/api/projects-api";
import SubprojectAllowedActions from "../../../model/project/SubprojectAllowedActions";
import Util from "../../../Util";
import ErrorView from "../../common/ErrorView";
import LoadingView from "../../common/LoadingView";
import SubprojectsTable from "./SubprojectsTable";

interface SubprojectSectionProps {
    projectCode: string;
    allowedActionsForTheUser: string[] | undefined;
}

export default function SubprojectsSection({projectCode, allowedActionsForTheUser}: SubprojectSectionProps): JSX.Element {
    const {keycloak} = useKeycloak();
    const navigate = useNavigate();


    const {data, error, isError, isLoading} = useGetSubprojectsQuery({
        token: keycloak.token,
        code: projectCode
        },
        {
            skip: !keycloak.authenticated || allowedActionsForTheUser === undefined
        }
    );
    if (isError) {
        return <ErrorView message={`Error loading subprojects: ${Util.getError(error).message}`} />;
    } else if (isLoading) {
        return <LoadingView fullMessage="Loading subprojects, please wait..."/>
    } else if (data) {
        if (keycloak.authenticated && allowedActionsForTheUser?.includes(ProjectAllowedActions.VIEW_SUBPROJECTS)) {
            return <Col className="p-3" xxl="6">
                        <b>Subprojects: </b>
                        {
                            data?.allowedActionsForTheUser.includes(SubprojectAllowedActions.CREATE)
                                ?  <Button title="New subproject" variant="link" className="m-0 ms-1 me-1 p-0" 
                                        onClick={() => {navigate(UrlFactory.subprojectNew(projectCode))}} >
                                        <FilePlusFill />
                                    </Button>
                                : null
                        } 
                        <div className="ps-4 mt-2">                        
                            <SubprojectsTable canEdit={data?.allowedActionsForTheUser
                                    .includes(SubprojectAllowedActions.EDIT) ?? false}
                                    projectCode={projectCode} subprojects={data.list} />
                        </div>   
                        
                    </Col>
        }
    }
    
    return <></>;    
}