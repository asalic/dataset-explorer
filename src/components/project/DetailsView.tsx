import React, { useMemo } from "react";
import { Alert, Col, Container, Image, Row } from "react-bootstrap";
import ErrorView from "../common/ErrorView";
import LoadingView from "../common/LoadingView";
import { useKeycloak } from "@react-keycloak/web";
import { api, useGetProjectConfigQuery, useGetProjectQuery, usePatchProjectMutation } from "../../service/singledata-api";
import { Link, useParams } from "react-router-dom";
import Util from "../../Util";
import NoLogoAvailable from "../common/NoLogoAvailable";
import UrlFactory from "../../service/UrlFactory";
import GenericFieldEdit from "../common/fieldedit/GenericFieldEdit";
import BodyFactorySpecType from "../../model/BodyFactorySpecType";
import License from "../../model/License";
import ProjectAllowedActions from "../../model/project/ProjectAllowedActions";
import SubprojectsSection from "./subproject/SubprojectsSection";
import LogoType from "../../model/project/LogoType";
import { useSaveProject } from "../../service/common-api-custom";
import { useAppSelector } from "../../service/hooks";

function getDefaultLicense(license: object | string | undefined): License | null {
    if (typeof license === "string") {
        if (license !== "") {
            return JSON.parse(license)
        } else {
            return null;
        }
    } else {
        return license as License;
    }
}

interface DetailsViewProps {
    keycloakReady: boolean;
    showDialog: Function;
}

function DetailsView({ keycloakReady, showDialog }: DetailsViewProps): JSX.Element {
    const { keycloak } = useKeycloak();
    const params = useParams();
    const code = params["code"] ?? "";



    const projectArgs = useMemo(
        () => ({ token: keycloak.token, code }),
        [keycloak.token, code]
    );
    const projQ = useGetProjectQuery(projectArgs,
        {
            skip: !code || !keycloakReady
        }
    )

    const confQ = useGetProjectConfigQuery({
        token: keycloak.token,
        code: code
    },
        {
            skip: !keycloakReady || !keycloak.authenticated
                || projQ.data?.allowedActionsForTheUser?.includes(ProjectAllowedActions.CONFIG) !== true
        }
    );
    const fulfilledTimeStamp = useAppSelector(
        (state) => api.endpoints.getProject.select(projectArgs)(state)?.fulfilledTimeStamp
    );

    // const { dataUpdatedAt } = api.endpoints.getProject.useQueryState({token: keycloak.token,
    //     code: code});
    const license = getDefaultLicense(confQ.data?.defaultLicense);
    // console.log(projQ);
    if (projQ.isLoading || confQ.isLoading) {
        return <LoadingView fullMessage="Loading project details, please wait..." />
    } else if (projQ.isError) {
        return <ErrorView message={Util.getError(projQ.error).message} />
    } else if (confQ.isError) {
        return <ErrorView message={Util.getError(confQ.error).message} />
    } else if (projQ.data) {
        return <Container>
            <Row>
                <Col>
                    <h3>
                        {projQ.data.name}
                        {
                            keycloak.authenticated && projQ.data.editablePropertiesByTheUser?.includes("name")
                                ? <GenericFieldEdit oldValue={projQ.data.name} field="name"
                                    keycloakReady={keycloakReady}
                                    fieldDisplay="project's name"
                                    showDialog={showDialog}
                                    patchMutation={usePatchProjectMutation}
                                    patchExternalFields={{
                                        code: projQ.data.code
                                    }}
                                    spec={BodyFactorySpecType.PROJECT} />
                                : <></>
                        }
                    </h3>
                </Col>
            </Row>
            <Row>
                <Col xxl="6" className="d-flex flex-column flex-wrap gap-3 limited-width-div">
                    <div className="d-flex flex-row flex-wrap p-2 gap-3">
                        <div className="d-flex flex-column flex-wrap p-2 gap-3 p-2" style={{ "maxWidth": "19rem" }}>
                            <div className="justify-content-center align-content-center"
                                style={{ "height": "18rem", "width": "18rem", "maxHeight": "18rem", "maxWidth": "18rem" }}>
                                {
                                    projQ.data.logoUrl
                                        ? <Image key={fulfilledTimeStamp} src={`${projQ.data.logoUrl}?ignoreThisQueryParamOnBackend=${fulfilledTimeStamp}`}
                                            style={{ "width": "18rem", "maxHeight": "18rem", "maxWidth": "18rem" }} />
                                        : <NoLogoAvailable />
                                }
                            </div>
                            {
                                keycloak.authenticated && projQ.data.editablePropertiesByTheUser?.includes("logoUrl")
                                    ? <GenericFieldEdit oldValue={{ type: LogoType.NONE }} field="logoUrl"
                                        keycloakReady={keycloakReady}
                                        fieldDisplay="the logo of the project"
                                        showDialog={showDialog}
                                        patchMutation={useSaveProject}
                                        patchExternalFields={{
                                            code: projQ.data.code
                                        }}
                                        spec={BodyFactorySpecType.PROJECT}>
                                        {projQ.data.logoUrl ? "Edit logo" : "Upload logo"}
                                    </GenericFieldEdit>


                                    // <Button variant="link">{projQ.data.logoUrl 
                                    //     ? "Edit logo" : "Upload logo"}</Button>
                                    : <></>
                            }
                        </div>
                        <div className="d-flex flex-column flex-wrap" style={{ "maxWidth": "38rem" } /* 60(limited-width-div) - 19(logo div) - 3(padding and gap) */}>
                            <span><b>Project code: </b>{projQ.data.code}</span>
                            {
                                projQ.data.externalUrl
                                    || (keycloak.authenticated && projQ.data.editablePropertiesByTheUser?.includes("externalUrl"))
                                    ? <span>
                                        <b>External URL: </b>
                                        <a href={projQ.data.externalUrl ?? "#"}>{projQ.data.externalUrl}</a>
                                        {
                                            keycloak.authenticated
                                                && projQ.data.editablePropertiesByTheUser?.includes("externalUrl")
                                                ? <GenericFieldEdit oldValue={projQ.data.externalUrl ?? ""} field="externalUrl"
                                                    keycloakReady={keycloakReady}
                                                    fieldDisplay="project's external URL"
                                                    showDialog={showDialog}
                                                    patchMutation={usePatchProjectMutation}
                                                    patchExternalFields={{
                                                        code: projQ.data.code
                                                    }}
                                                    spec={BodyFactorySpecType.PROJECT} />
                                                : <></>
                                        }
                                    </span>
                                    : <></>
                            }
                            {
                                projQ.data.allowedActionsForTheUser?.includes(ProjectAllowedActions.CONFIG)
                                    ? <>
                                        <span><b>Creating datasets</b></span>
                                        <div className="d-flex flex-column flex-wrap ms-4">
                                            <span><b>Default contact info: </b>{confQ.data?.defaultContactInfo ?? ""}</span>
                                            <span><b>Default license: </b>{
                                                license ? (
                                                    license.url ? <a href={license.url}>{license.title ?? license.url}</a>
                                                        : license.title ?? ""
                                                )
                                                    : ""
                                            }
                                            </span>
                                        </div>
                                        <span><b>Publishing datasets</b></span>
                                        <div className="d-flex flex-column flex-wrap ms-4">
                                            <span><b>Zenodo author: </b>{confQ.data?.zenodoAuthor}</span>
                                            <span><b>Zenodo community: </b>{confQ.data?.zenodoCommunity}</span>
                                            <span><b>Zenodo grant: </b>{confQ.data?.zenodoGrant}</span>
                                            <span><b>Zenodo API token: </b>{confQ.data?.zenodoAccessToken}</span>
                                        </div>
                                        <Link to={UrlFactory.projectConfigEdit(code)}>Edit project configuration</Link>
                                    </>
                                    : <></>
                            }

                            <Link to={`/datasets?invalidated=false&project=${projQ.data.code}`}>List of Datasets</Link>
                        </div>

                    </div>
                    <div className="w-100">
                        <b className="w-100">Description:</b>
                        {
                            keycloak.authenticated
                                && projQ.data.editablePropertiesByTheUser?.includes("shortDescription")
                                ? <GenericFieldEdit oldValue={projQ.data.shortDescription ?? ""} field="shortDescription"
                                    keycloakReady={keycloakReady}
                                    fieldDisplay="project's description"
                                    showDialog={showDialog}
                                    patchMutation={usePatchProjectMutation}
                                    patchExternalFields={{
                                        code: projQ.data.code
                                    }}
                                    spec={BodyFactorySpecType.PROJECT} />
                                : <></>
                        }
                        <div className="w-100 ms-4" dangerouslySetInnerHTML={{ __html: projQ.data.shortDescription ?? "" }}></div>
                    </div>
                </Col>
                <SubprojectsSection allowedActionsForTheUser={projQ.data?.allowedActionsForTheUser}
                    projectCode={code} />
            </Row>
        </Container>;
    } else {
        return <Alert variant="secondary">
            No projects available.
        </Alert>;
    }
}

export default DetailsView;