import { useKeycloak } from "@react-keycloak/web";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import LoadingView from "../../../common/LoadingView";
import ErrorView from "../../../common/ErrorView";
import { useGetProjectsQuery, useLazyGetSubprojectsQuery } from "../../../../service/api/projects-api";
import { useLazyGetUpgradableDatasetsQuery, usePostDatasetMutation } from "../../../../service/api/datasets-api";
import { useGetSingleDataPageQuery } from "../../../../service/api/singledata-api";
import SingleDataType from "../../../../model/SingleDataType";
import Util from "../../../../Util";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import type Subproject from "../../../../model/project/Subproject";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../../../service/UrlFactory";
import CollectionMethodType from "../../../../model/CollectionMethodType";
import SingleDataTypeApiType from "../../../../model/SingleDataTypeApiType";
import type UpgradableDataset from "../../../../model/UpgradableDataset";
import Select, { type Props, type GroupBase, type SingleValue } from "react-select";
import MultiMessageBox from "../../../common/MultiMessageBox";

interface SelOpt {
    value: string;
    label: string;

}

function toSelId(val: UpgradableDataset): SelOpt {
    return { value: val.id, label: `${val.name} (${val.version}) (${val.id})` }
}

function CustomSelect<
    // Option = SelOpt,
    IsMulti extends boolean = false,
    Group extends GroupBase<SelOpt> = GroupBase<SelOpt>
>(props: Props<SelOpt, IsMulti, Group>) {
    return (
        <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
    );
}

interface NewDatasetProps {

    keycloakReady: boolean;
}

// const TYPE_PREFIX = "type-";
// const COLLECTION_METHOD_PREFIX = "collection-method-";


export default function NewDataset({ keycloakReady }: NewDatasetProps): JSX.Element {
    let { keycloak } = useKeycloak();
    const [errorPostDataset, setErrorPostDataset] = useState<string | null>(null);
    const [previousId, setPreviousId] = useState<SelOpt | null>(null);
    const navigate = useNavigate();
    const [project, setProject] = useState<string>("");
    const [subproject, setSubproject] = useState<string>("");
    const [createNotAllowedMsgs, setCreateNotAllowedMsgs] = useState<string[]>([]);

    const datasetsQuery = useGetSingleDataPageQuery({
        token: keycloak.token,
        singleDataType: SingleDataType.DATASET,
        qParams: {
            skip: 0, limit: 0
        }
    },
        {
            skip: !keycloakReady || !keycloak.authenticated
        }
    );

    const projectsQuery = useGetProjectsQuery({
        token: keycloak.token,
        purpose: "datasetCreation"
    }, {
        skip: !keycloakReady || !keycloak.authenticated
            || datasetsQuery.data?.allowedActionsForTheUser.includes("create") === false
    });

    const [subprojectsQueryLazy, subprojectsQueryLazyState] = useLazyGetSubprojectsQuery();
    const [upgradeableQueryLazy, upgradeableQueryLazyState] = useLazyGetUpgradableDatasetsQuery();

    const [postDataset] = usePostDatasetMutation();

    useEffect(() => {
        if (projectsQuery.data) {
            const lst = (projectsQuery.data as string[]);
            if (lst.length !== 0) {
                setProject(lst[0] ?? "");
                upgradeableQueryLazy({
                    token: keycloak.token!,
                    project: lst[0]!
                });
            }
        }

    }, [projectsQuery.data, setProject, upgradeableQueryLazy, keycloak.token])

    // Execute when the project changes
    useEffect(() => {
        setPreviousId(null);
        setSubproject("");
        if (project !== "") {
            subprojectsQueryLazy({
                token: keycloak.token,
                code: project
            });


        }
    }, [subprojectsQueryLazy, project, keycloak.token]);

    // SHow warning for those cases when the user is not allows to create a dataset
    useEffect(() => {
        const msgs = [];
        if (subprojectsQueryLazyState.data?.list.length === 0) {
            msgs.push("Please choose a project with subprojects to create a dataset.");
        }
        if (previousId === null || upgradeableQueryLazyState.data?.length === 0) {
            msgs.push("Please choose the previous version of the dataset.");
        }
        if (upgradeableQueryLazyState.data?.length === 0) {
            msgs.push("Please select a project with upgradeable datasets that allows you to set a previous version for this dataset.");
        }
        setCreateNotAllowedMsgs(msgs)
    }, [previousId, subprojectsQueryLazyState.data, upgradeableQueryLazyState.data, setCreateNotAllowedMsgs]);

    const onProjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const code = event.target.value;
        setProject(code);
        upgradeableQueryLazy({
            token: keycloak.token!,
            project: code
        });
        // subprojectsQueryLazy({
        //         token: keycloak.token,
        //         code
        //     })
    }

    const onSubprojectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSubproject(event.target.value);
    }

    const updSelectedOption = useCallback((newVal: SingleValue<SelOpt>) => {
        setPreviousId(newVal);
    }, [setPreviousId]);

    const isFormDisabled = subprojectsQueryLazyState.isLoading || projectsQuery.isLoading
        || upgradeableQueryLazyState.isLoading;
    const submitDisabled = isFormDisabled || subprojectsQueryLazyState.data?.list.length === 0
        || upgradeableQueryLazyState.data?.length === 0 || previousId === null;

    const onCreateDataset = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        setErrorPostDataset(null);
        const formData = new FormData(e.target as HTMLFormElement);
        e.preventDefault();
        // const type = [];
        // const collectionMethod = [];
        console.log(previousId);
        formData.append("previousId", previousId?.value ?? "")
        // for (const pair of formData.entries()) {
        //     // if (pair[0].startsWith(TYPE_PREFIX)) {
        //     //     type.push(pair[0].substring(TYPE_PREFIX.length));
        //     //     formData.delete(pair[0]);
        //     // } else if (pair[0].startsWith(COLLECTION_METHOD_PREFIX)) {
        //     //     collectionMethod.push(pair[0].substring(COLLECTION_METHOD_PREFIX.length));
        //     //     formData.delete(pair[0]);
        //     // }
        //     console.log(pair[0], pair[1]);
        // }
        // formData.append("type", type);
        // formData.append("collectionMethod", collectionMethod);
        try {
            const result = await postDataset({
                token: keycloak.token ?? "",
                formData
            }).unwrap();
            window.location.href = result.url;
        } catch (e: any) {
            setErrorPostDataset(Util.getError(e).message);
        }
    }, [setErrorPostDataset, previousId, postDataset, keycloak.token, setErrorPostDataset])

    if (!keycloakReady) {
        return <LoadingView fullMessage="Connecting to the OIDC provider, please wait..." />
    } else if (keycloakReady && (!keycloak.authenticated || datasetsQuery.data?.allowedActionsForTheUser.includes("create") === false)) {
        return <ErrorView message="You are not authorized to access this page." />
    } else if (datasetsQuery.isLoading || projectsQuery.isLoading) {
        return <LoadingView what="Loading form data" />
    } else if (datasetsQuery.isError) {
        return <ErrorView message={Util.getError(datasetsQuery.error).message} />
    } else if (projectsQuery.isError) {
        return <ErrorView message={Util.getError(projectsQuery.error).message} />
    } else if (subprojectsQueryLazyState.isError) {
        return <ErrorView message={`Cannot load subprojects: ${Util.getError(subprojectsQueryLazyState.error).message}`} />
    } else if (upgradeableQueryLazyState.isError) {
        return <ErrorView message={`Cannot load upgradable datasets: ${Util.getError(subprojectsQueryLazyState.error).message}`} />
    } else if (projectsQuery.data && (projectsQuery.data as string[]).length === 0) {
        return <ErrorView message={`No projects found. You cannot create datasets.`} />
    } else {
        const projectsList = projectsQuery.data ? (projectsQuery.data as string[]) : [];
        return <Container fluid="xxl">
            <h3 className="mb-4">Create new dataset</h3>
            {
                subprojectsQueryLazyState.isLoading ? <LoadingView what={`subprojects of project '${project}'`} />
                    : null
            }
            <MultiMessageBox variant="warning" messages={createNotAllowedMsgs} />
            {
                errorPostDataset ? <ErrorView message={`Error creating the dataset: ${errorPostDataset}`} /> : null
            }
            <Alert variant="info">
                This approach is designed for creating new versions of existing datasets.
                To get started, please access this page from a desktop running on our platform that has access to the base dataset.
                You can then use the existing <b>index.json</b> and <b>eforms.json</b> files as a starting point to modify or adjust the content.
            </Alert>
            <Form onSubmit={onCreateDataset} className="px-3">
                <Row>
                    <Col xxl="4" md="6">
                        <Form.Group title="Short descriptive name." className="mb-4">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Short descriptive name." disabled={isFormDisabled} name="name" />
                        </Form.Group>
                        <Form.Group title="Dataset version." className="mb-4">
                            <Form.Label>Version</Form.Label>
                            <Form.Control type="text" placeholder="The version of this dataset." disabled={isFormDisabled} name="version" />
                        </Form.Group>
                        <Form.Group controlId="project" className="mb-4">
                            <Form.Label>Project</Form.Label>
                            <Form.Select aria-label="Select project" value={project} onChange={onProjectChange} disabled={isFormDisabled} name="project">
                                {
                                    projectsList.map((p: string) => <option key={p} value={p}>{p}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="subproject" className="mb-4">

                            <Form.Label>Subproject</Form.Label>
                            {
                                subprojectsQueryLazyState.data?.list.length === 0 ?
                                    <Alert variant="info">This project doesn't have any subprojects</Alert>
                                    : <Form.Select aria-label="Select project" value={subproject}
                                        onChange={onSubprojectChange} disabled={isFormDisabled} name="subproject">
                                        {
                                            subprojectsQueryLazyState.data?.list.map((p: Subproject) => <option key={p.code} value={p.code}>{p.name}</option>)
                                        }
                                    </Form.Select>
                            }

                        </Form.Group>
                        <Form.Group title="Previous dataset version." className="mb-4">
                            <Form.Label>Previous dataset</Form.Label>
                            {/* <Form.Control type="text" placeholder="When it is a new version of a previous dataset." 
                                disabled={isFormDisabled} name="previousId" /> */}
                            <CustomSelect
                                isClearable
                                isSearchable
                                value={previousId}
                                onChange={updSelectedOption}
                                options={upgradeableQueryLazyState.data?.map(e => { return toSelId(e); }) ?? []}
                            />
                        </Form.Group>

                        <Form.Group title="Short text with the provenance of the data." className="mb-4">
                            <Form.Label>Provenance</Form.Label>
                            <Form.Control as="textarea" rows={3}
                                placeholder="Short text with the provenance of the data."
                                disabled={isFormDisabled} name="provenance" />
                        </Form.Group>
                    </Col>
                    <Col xxl="8" md="6">
                        <Row>
                            <Col xxl="6" md="12">
                                <Form.Group title="Dataset description." className="mb-4">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        placeholder="Long explanation of dataset details, statistics, links, references, improvements/modifications if it's a new version, etc."
                                        disabled={isFormDisabled} name="description" />
                                </Form.Group>
                                <Form.Group title="Dataset type." className="mb-4">
                                    <Form.Label>Type</Form.Label>
                                    {
                                        Object.values(SingleDataTypeApiType).map(c => <Form.Check key={c} name="type" type="switch" label={c} value={c} />)
                                    }

                                </Form.Group>
                                <Form.Group title="Collection method." className="mb-4">
                                    <Form.Label>Collection method</Form.Label>
                                    {
                                        Object.values(CollectionMethodType).map(c => <Form.Check key={c} name="collectionMethod" type="switch" label={c} value={c} />)
                                    }

                                </Form.Group>
                            </Col>
                            <Col xxl="6" md="12">
                                <Form.Group title="Short text with the intended purpose of the dataset." className="mb-4">
                                    <Form.Label>Purpose</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        placeholder="Short text with the intended purpose of the dataset."
                                        disabled={isFormDisabled} name="purpose" />
                                </Form.Group>
                                <Form.Group className="mb-4" title="The eforms.json containing the clinical data to upload">
                                    <Form.Label>Clinical data file upload</Form.Label>
                                    <Form.Control type="file" disabled={isFormDisabled} name="clinicalData" />
                                </Form.Group>
                                <Form.Group controlId="index" className="mb-4" title="The index.json to upload">
                                    <Form.Label>Index file upload</Form.Label>
                                    <Form.Control type="file" disabled={isFormDisabled} name="index" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Group className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={submitDisabled}>Create</Button>
                    <Button variant="secondary" onClick={() => navigate(UrlFactory.singleData(SingleDataType.DATASET))}>Cancel</Button>
                </Form.Group>
            </Form>
        </Container>
    }
}