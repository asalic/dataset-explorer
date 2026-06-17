import ProjectConfig from "../../model/project/ProjectConfig";
import { ProjectFull } from "../../model/project/ProjectFull";
import Subproject from "../../model/project/Subproject";

export interface PutProjectT {
    projectFull: ProjectFull;
    token: string;
}

export interface PutProjectConfigT {
    projectConfig: ProjectConfig;
    token: string;
    code: string;
}

export interface PutProjectLogoT {
    token: string;
    code: string;
    logo: File | null;
}

export interface GetProjectsT {
    token: string | null | undefined;
    purpose: "projectList" | "datasetCreation" | "datasetSearchFilter" | "userManagement";
}

export interface GetProjectT {
    token: string | null | undefined;
    code: string;
}

export interface GetProjectConfigT {
    token: string | null | undefined;
    code: string;
}

export interface PatchProjectT {
    token: string | null | undefined;
    code: string;
    property: string;
    value: string | boolean | null;
}

export interface GetSubprojectsT {
    token: string | null | undefined;
    code: string;

}

export interface PutSubprojectT {
    partialSubproject: Partial<Subproject>;
    code: string;
    subcode: string;
    token: string;
}
