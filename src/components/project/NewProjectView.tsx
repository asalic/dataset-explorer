import { type SyntheticEvent, useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../service/UrlFactory";
import {  usePutProjectLogoMutation, usePutProjectMutation } from "../../service/singledata-api";
import { useKeycloak } from "@react-keycloak/web";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";
import LoadingView from "../common/LoadingView";
import ConfigEditorCommon from "./ConfigEditorCommon";
import type ProjectConfig from "../../model/project/ProjectConfig";
import LogoAdmin from "./LogoAdmin";
import type Logo from "../../model/project/Logo";
import LogoType from "../../model/project/LogoType";
import Message from "../../model/Message";


interface NewProjectViewProps {
    setCreatedSuccessfully?: Function;
    postMessage: Function;
}


function NewProjectView({ setCreatedSuccessfully, postMessage }: NewProjectViewProps): JSX.Element {

    const [projectConfig, setConfig] = useState<ProjectConfig>({})
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { keycloak } = useKeycloak();
    const [putProject] = usePutProjectMutation();
    const [putProjectLogo] = usePutProjectLogoMutation();

    const [logo, setLogo] = useState<Logo>({ type: LogoType.NONE });

    const submit = useCallback(async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setSubmitError(null);
        // const target = e.target as HTMLFormElement;
        // typeof e.target & {
        //     name: { value: string };
        //     code: { value: string };
        //     externalUrl: { value: string; }
        //     shortDescription: { value: string; }
        // };
        const formData = new FormData(e.currentTarget);
        if (keycloak.token) {
            if (!formData.get("code")) {
                setSubmitError("Please set the project code.");
            } else if (!formData.get("name")) {
                setSubmitError("Please set the project name.");
            } else if (logo?.type === LogoType.UPLOAD_IMAGE && !logo.logo) {
                setSubmitError("You have chosen to upload a project logo file, please select a file for the project's logo.");
            } else if (logo?.type === LogoType.EXTERNAL_LINK && !logo.logo) {
                setSubmitError("You have chosen to set a project's logo via an external link, please set a logo URL.");
            } else {
                try {
                    setIsLoading(true);
                    await putProject({
                        projectFull: {
                            name: formData.get("name")?.toString() ?? "",
                            code: formData.get("code")?.toString() ?? "",
                            externalUrl: formData.get("externalUrl.value")?.toString() ?? "",
                            logoUrl: logo?.type === LogoType.EXTERNAL_LINK ? (logo.logo as string) : "",
                            shortDescription: formData.get("shortDescription.value")?.toString() ?? "",
                            projectConfig
                        },
                        token: keycloak.token
                    }).unwrap();
                    if (logo.type === LogoType.UPLOAD_IMAGE) {
                        try {
                            await putProjectLogo({ token: keycloak.token, code: formData.get("code")?.toString() ?? "", 
                                logo: (logo.logo as File) }).unwrap();
                        } catch (e) {
                            postMessage(new Message(Message.ERROR, `Error uploading and procesing the logo for the project with code '${formData.get("code")}' and name '${formData.get("name")}'`, 
                                Util.getError(e).message));
                        }

                    }
                    setCreatedSuccessfully?.(true);
                    navigate(UrlFactory.projects());
                } catch (e: any) {
                    console.error(e);
                    setSubmitError(Util.getError(e).message);
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            setSubmitError("Please authenticate to submit a new project.");
        }

    }, [putProject, projectConfig, keycloak.token, setSubmitError, submitError, setIsLoading, setCreatedSuccessfully, logo]);

    const onLogoSet = (logo: Logo) => {
        setLogo(logo);
    }

    // useEffect(() => {
    //     if (data === true && !isLoading && !isError && submitError === null) {
    //         if (submitError) {
    //             setSubmitError(null);
    //         }
    //         if (logo?.type === LogoType.UPLOAD_IMAGE) {
    //             if (keycloak.token) {
    //                 if (logo.logo) {
    //                     putProjectLogo();
    //                 } else { //It shouldn't enter this case
    //                     setSubmitError("Please select a file as project logo.");
    //                 }
    //             } else { 
    //                 setSubmitError("Please authenticate to upload a logo.");
    //             }
    //         } else {
    //             navigate(UrlFactory.projects());
    //             if (setCreatedSuccessfully) {
    //                 setCreatedSuccessfully(true);
    //             }

    //         }
    //     }

    // }, [data, isLoading, isError, submitError, putProjectLogoState, putProjectLogo])
    return <>
        {
            submitError ? <ErrorView message={submitError} /> : <></>
        }

        {
            isLoading ? <LoadingView fullMessage="Creating project, please wait..." /> : <></>
        }
        <Form className="ms-2 me-2 limited-width-form" onSubmit={submit}>
            <Form.Group className="mb-3" title="Set the code of the project. This field is required.">
                <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                <Form.Control placeholder="Enter project's code" name="code" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the name of the project">
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Form.Control placeholder="Enter project's name" name="name" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the external URL of the project">
                <Form.Label>External URL</Form.Label>
                <Form.Control placeholder="Enter a relevant external URL" name="externalUrl" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the URL of the project's logo. The image will be downloaded by the server.">
                <Form.Label>Logo</Form.Label>
                <LogoAdmin className="ms-4" onLogoSet={onLogoSet} externalLogo={logo}/>

            </Form.Group>


            <Form.Group className="mb-3" title="Set a short description for the project.">
                <Form.Label>Short description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter a short description" name="shortDescription" />
            </Form.Group>

            <ConfigEditorCommon setConfig={setConfig} />

            <div className="w-100 ms-2">
                <span className="text-danger">*</span> required field
            </div>

            <Button variant="primary" type="submit" className="ms-4 mt-4 me-2">
                Submit
            </Button>

            <Button variant="secondary" className="mt-4" onClick={() => navigate(UrlFactory.projects())}>
                Cancel
            </Button>
        </Form>
    </>
}

export default NewProjectView;