import React, { FormEvent } from "react";
import { useGetSiteQuery, usePutSiteMutation } from "../../service/site-api";
import { useKeycloak } from "@react-keycloak/web";
import MessageView from "../common/MessageView";
import LoadingView from "../common/LoadingView";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";
import Site from "../../model/site/Site";
import { Button, Form } from "react-bootstrap";
import Message from "../../model/Message";
import UrlFactory from "../../service/UrlFactory";
import { useNavigate } from "react-router-dom";
interface SiteEditorProps {
    siteCode?: string | null;
}

interface SiteFormProps {
    site: Site;
}


function SiteForm({site}: SiteFormProps): JSX.Element {
    const isUpdate = site.code.length > 0;

    const {keycloak} = useKeycloak();
        const navigate = useNavigate();
    const [putSite, {isError, isLoading, error } ] = usePutSiteMutation();
    
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            name: { value: string };
            code: { value: string };
            country: {value: string;}
            url: {value: string;}
            contactName: {value: string;}
            contactEmail: {value: string;}
              };
        const site: Site = {
            code: target.code.value,
            name: target.name.value,
            country: target.country.value,
            url: target.url.value,
            contactName: target.contactName.value,
            contactEmail: target.contactEmail.value
        }
        //Wait till we've got a response, if not error navigate to the list of sites
        try {
            await putSite({
                token: keycloak.token,
                site
            }).unwrap();
            if (!isUpdate) {
                navigate(UrlFactory.sites());
            }
        } catch (e) {
            console.error(e);
        }
        
    }

    return <>
        {
            isError ? <ErrorView message={Util.getError(error).message} /> : null
        }
        {
            isLoading ? <LoadingView fullMessage={`${isUpdate ? "Updating site" : "Creating new site"}, please wait...`} /> : null
        }
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" title="Set the code of the site. This field is required.">
                <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                <Form.Control disabled={isLoading || isUpdate} placeholder="Enter project's code" readOnly={isUpdate} name="code" key={site.code ?? "code"} defaultValue={site.code} />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the name of the site. This field is required.">
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Form.Control disabled={isLoading} placeholder="Enter project's name" name="name" key={site.name ?? "name"} defaultValue={site.name}/>
            </Form.Group>
            <Form.Group className="mb-3" title="Set the country of the site. This field is required.">
                <Form.Label>Country <span className="text-danger">*</span></Form.Label> 
                <Form.Control disabled={isLoading} placeholder="Enter the country name" name="country" key={site.country ?? "country"} defaultValue={site.country}/>
            </Form.Group>
            <Form.Group className="mb-3" title="Set the URL of the site">
                <Form.Label>URL</Form.Label>
                <Form.Control disabled={isLoading} placeholder="Enter a URL for this site" name="url" key={site.url ?? "url"} defaultValue={site.url ?? ""}/>
            </Form.Group>

            <Form.Group className="mb-3" title="The name of the contact">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control disabled={isLoading} placeholder="Enter the name of the contact" name="contactName" key={site.contactName ?? "contactName"} defaultValue={site.contactName ?? ""}/>
            </Form.Group>

            <Form.Group className="mb-3" title="The contact's email">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control disabled={isLoading} placeholder="Enter the contact's email" name="contactEmail" key={site.contactEmail ?? "contactEmail"} defaultValue={site.contactEmail ?? ""}/>
            </Form.Group>

            <div  className="w-100 ms-2">
                <span className="text-danger">*</span> required field
            </div>      

            <Button disabled={isLoading} variant="primary" type="submit" className="ms-4 mt-4 me-2">
                { isUpdate ? "Update" : "Create"}
            </Button>

            {
                !isUpdate ? <Button type="button" variant="secondary" className=" mt-4" 
                            onClick={() => navigate(UrlFactory.sites())}>
                        Cancel
                    </Button>
                    : null
            }

        </Form>
    </>;
}

export default function SiteEditor({siteCode}: SiteEditorProps): JSX.Element {
    const {keycloak} = useKeycloak();
    const { data, error, isError, isLoading } = useGetSiteQuery({
        token: keycloak.token,
        siteCode: siteCode ?? ""
        },
        {
            skip: !keycloak.authenticated || siteCode === undefined || siteCode === null
        }
    );

    if (isLoading) {
        return <LoadingView fullMessage="Loading site information" />
    } else if (isError) {
        return <ErrorView message={Util.getError(error).message} />;
    } else if (data) {
        return <SiteForm site={data} />
    } else {
        // When no site name received as a prop, it means we have a New editor
        if (!siteCode) {
            return <SiteForm site={{
                code: "",
                name: "",
                country: "",
                url: "",
                contactName: "",
                contactEmail: ""
            }} />
        } else {
            return <MessageView message={new Message(Message.INFO, "No data available")} />
        }
    }

}