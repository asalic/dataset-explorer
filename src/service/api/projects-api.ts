import { EndpointBuilder } from "@reduxjs/toolkit/query";
import {api} from "./api";
import { BASE_URL_API, call, generateError } from "./common-api";
import { GetProjectConfigT, GetProjectsT, GetProjectT, GetSubprojectsT, PatchProjectT, PutProjectConfigT, PutProjectLogoT, PutProjectT, PutSubprojectT } from "./projects-api-types";
import ProjectList from "../../model/project/ProjectList";
import Project from "../../model/project/Project";
import ProjectConfig from "../../model/project/ProjectConfig";
import SubprojectList from "../../model/project/SubprojectList";

export const projectsApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<any, any, any>) => ({

        putProject: build.mutation<boolean, PutProjectT>({
            queryFn: async ({ projectFull, token }: PutProjectT) => {
                try {
                    const headers = new Map([["Content-Type", "application/json"]]);
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    } else {
                        return { error: generateError("Invalid token.") }
                    }
                    await call("PUT",
                        `${BASE_URL_API}/projects/${projectFull.code}`, headers,
                        JSON.stringify(projectFull), "text", null);
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ProjectList"],
        }),

        putProjectConfig: build.mutation<boolean, PutProjectConfigT>({
            queryFn: async ({ projectConfig, token, code }: PutProjectConfigT) => {
                try {
                    const headers = new Map([["Content-Type", "application/json"]]);
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    } else {
                        return { error: generateError("Invalid token.") }
                    }
                    await call("PUT",
                        `${BASE_URL_API}/projects/${code}/config`, headers,
                        JSON.stringify(projectConfig), "text", null);
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ProjectConfig"],
        }),

        putProjectLogo: build.mutation<boolean, PutProjectLogoT>({
            queryFn: async ({ token, code, logo }: PutProjectLogoT) => {
                try {
                    const headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    } else {
                        return { error: generateError("Invalid token.") }
                    }
                    const formData = new FormData();
                    formData.append("logo", logo ?? "");
                    await call("PUT", `${BASE_URL_API}/projects/${code}/logo`, headers,
                        formData, "text", null);
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ProjectList", "Project"],
        }),


        getProjects: build.query<ProjectList | Array<string>, GetProjectsT>({
            queryFn: async ({ token, purpose }: GetProjectsT) => {
                try {
                    let headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    }
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/projects?purpose=${purpose}`, headers,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["ProjectList"],
        }),

        getProject: build.query<Project, GetProjectT>({
            queryFn: async ({ token, code }: GetProjectT) => {
                try {
                    let headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    }
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/projects/${code}`, headers,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["Project"],
        }),

        getProjectConfig: build.query<ProjectConfig, GetProjectConfigT>({
            queryFn: async ({ token, code }: GetProjectConfigT) => {
                try {
                    let headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    }
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/projects/${code}/config`, headers,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["ProjectConfig"],
        }),

        patchProject: build.mutation<boolean, PatchProjectT>({
            queryFn: async ({ token, code, property, value }: PatchProjectT) => {
                try {
                    if (!token) {
                        return { error: generateError("Invalid token.") }
                    }
                    await call("PATCH",
                        `${BASE_URL_API}/projects/${code}`,
                        token ? new Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                        JSON.stringify({ property, value }), "text", null)
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["Project", "ProjectList"],
        }),

        getSubprojects: build.query<SubprojectList, GetSubprojectsT>({
            queryFn: async ({ token, code }: GetSubprojectsT) => {
                try {
                    let headers = new Map();
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    }
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/projects/${code}/subprojects`, headers,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }

            },
            providesTags: ["SubprojectList"],
        }),

        putSubproject: build.mutation<boolean, PutSubprojectT>({
            queryFn: async ({ partialSubproject, code, subcode, token }: PutSubprojectT) => {
                try {
                    const headers = new Map([["Content-Type", "application/json"]]);
                    if (token) {
                        headers.set("Authorization", "Bearer " + token);
                    } else {
                        return { error: generateError("Invalid token.") }
                    }
                    await call("PUT",
                        `${BASE_URL_API}/projects/${code}/subprojects/${subcode}`, headers,
                        JSON.stringify(partialSubproject), "text", null);
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["SubprojectList"],
        }),
  }),
});

export const {
    usePutProjectMutation,
    usePutProjectConfigMutation,
    usePutProjectLogoMutation,
    useGetProjectsQuery,
    useGetSubprojectsQuery,
    useLazyGetSubprojectsQuery,
    usePutSubprojectMutation,
    useGetProjectQuery,
    useGetProjectConfigQuery,
    usePatchProjectMutation

} = projectsApi;

