import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import { useGetSubprojectsQuery, usePutSubprojectMutation } from "../../../service/api/projects-api";
import Util from "../../../Util";
import ErrorView from "../../common/ErrorView";
import LoadingView from "../../common/LoadingView";
import { useKeycloak } from "@react-keycloak/web";
import type Subproject from "../../../model/project/Subproject";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UrlFactory from "../../../service/UrlFactory";
import FormRequiredFieldInfo from "../../common/FormRequiredFieldInfo";

// interface SubprojectEditor {
//     projectCode: string;
//     subprojectCode?: string | null | undefined;
// }

const MIN_SUBPROJECT_CODE_LEN = 2;

export default function SubprojectEditor(): JSX.Element {
    const {keycloak} = useKeycloak();
    const navigate = useNavigate();
    const params = useParams();

    const projectCode = params["code"];
    const subprojectCode = params["subcode"];
    const isCreator = subprojectCode === undefined || subprojectCode === null || subprojectCode?.length === 0;
    const [subproject, setSubproject] = useState<Partial<Subproject>>({});
    const [localError, setLocalError] = useState<string | null>(null);



    const { data, isLoading, error, isError } = useGetSubprojectsQuery({
            token: keycloak.token,
            code: projectCode ?? ""
        },
        {
            skip: !projectCode || !keycloak.authenticated || isCreator
        }
    )

    useEffect(() => {
        if (data) {
            setSubproject(data.list.find(sp => sp.code === subprojectCode) ?? {});
        }
    }, [data, setSubproject]);

    const [putSubproject, {isError: isPutSubprojectError, isLoading: isPutSubprojectLoading, error: putSubprojectError } ] = usePutSubprojectMutation();


    const updField = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSubproject((v) => {return {...v, [e.target.name]: e.target.value };});
    }, [setSubproject]);

    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        let err = false;
        const subcode = subprojectCode ?? subproject?.code;
        if ((subcode?.length ?? 0) < MIN_SUBPROJECT_CODE_LEN) {
            setLocalError(`The subproject code must be a string with a minimum legth of ${MIN_SUBPROJECT_CODE_LEN}`);
            err = true;
        }

        if (!err) {
            putSubproject({
                token: keycloak.token ?? "",
                code: projectCode ?? "",
                subcode: subcode ?? "",
                partialSubproject: subproject
            });
            setLocalError(null);
            navigate(UrlFactory.projectDetails(projectCode ?? ""));
        }
    }, [subproject, putSubproject, setLocalError, subprojectCode, projectCode, keycloak.token])
    if (!projectCode) {
        return <ErrorView message="Cannot get the project code from the URL path." />
    }
    if (!isCreator) {
        if (isLoading || !keycloak.authenticated) {
            return <LoadingView fullMessage="Loading subproject, please wait..."/>
        } else if (isError) {
            return <ErrorView message={Util.getError(error).message} />
        }
    }
    return <Container>
        {
            localError ? <ErrorView message={localError} /> : null
        }
        {
            isPutSubprojectError ? <ErrorView message={Util.getError(putSubprojectError).message} /> : null
        }
        {
            isPutSubprojectLoading ? <LoadingView fullMessage={`${isCreator ? "Creating" : "Updating"} subproject, please wait...`}/> : null
        }
        <Form onSubmit={onSubmit}>
            <Form.Group as={Row} className="mb-3" title="Set the code of the subproject. This field is required.">
                <Form.Label column lg={2} xl={2} xxl={1}>Code<span className="text-danger">*</span></Form.Label>
                <Col lg={10} xl={10} xxl={11}>
                    <Form.Control placeholder="Enter project's code" name="code" readOnly={!isCreator} disabled={!isCreator}
                        value={subproject?.code ?? ""} onChange={updField}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" title="Set the name of the subproject. This field is required.">
                <Form.Label column lg={2} xl={2} xxl={1}>Name<span className="text-danger">*</span></Form.Label>
                <Col lg={10} xl={10} xxl={11}>
                    <Form.Control placeholder="Enter project's name" name="name" 
                        value={subproject?.name ?? ""} onChange={updField}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" title="Set the description of the subproject. This field is required.">
                <Form.Label column lg={2} xl={2} xxl={1}>Description<span className="text-danger">*</span></Form.Label>
                <Col lg={10} xl={10} xxl={11}>
                    <Form.Control as="textarea" rows={2} placeholder="Enter project's description" name="description"
                        value={subproject?.description ?? ""} onChange={updField}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" title="Set the external ID of the subproject.">
                <Form.Label column lg={2} xl={2} xxl={1}>External ID</Form.Label>
                <Col lg={10} xl={10} xxl={11}>
                    <Form.Control placeholder="Enter project's external ID" name="externalId"
                        value={subproject?.externalId ?? ""} onChange={updField}/>
                </Col>
            </Form.Group>

            <FormRequiredFieldInfo />

            <Button variant="primary" type="submit" className="ms-4 mt-4 me-2">
                { isCreator ? "Create" : "Update" }
            </Button>

            <Button variant="secondary"  className="mt-4" 
                    onClick={() => navigate(UrlFactory.projectDetails(projectCode))}>
                Cancel
            </Button>
        </Form>
    </Container>
}