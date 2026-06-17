import { EndpointBuilder } from "@reduxjs/toolkit/query";
import {api} from "./api";
import ItemPage from "../../model/ItemPage";
import UserListItem from "../../model/user/UserListItem";
import { GetUserManagementJobLogsT, GetUserManagementJobsT, GetUserRolesT, GetUserSitesT, GetUsersPageT, GetUserT, PutUserT } from "./users-api-types";
import { BASE_URL_API, call, generateError } from "./common-api";
import User from "../../model/user/User";
import ManagementJob from "../../model/ManagementJob";

export const usersApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<any, any, any>) => ({


        getUsersPage: build.query<ItemPage<UserListItem>, GetUsersPageT>({
            queryFn: async ({ token, qParams }: GetUsersPageT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/users`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", qParams)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
            providesTags: ["UserList"],
        }),

        getUser: build.query<User, GetUserT>({
            queryFn: async ({ token, username }: GetUserT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/users/${username}?scope=all`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
            providesTags: ["User"],
        }),

        putUser: build.mutation<boolean, PutUserT>({
            queryFn: async ({ user, token, username }: PutUserT) => {
                try {
                    const headers = new Map([["Content-Type", "application/json"]]);
                    if (token) { headers.set("Authorization", "Bearer " + token); }
                    else { return { error: generateError("Invalid token.") } }
                    await call("PUT",
                        `${BASE_URL_API}/users/${username}`, headers,
                        JSON.stringify(user), "text", null);
                    return { data: true };
                } catch (error) { return { error: generateError(error) }; }
            },
            invalidatesTags: ["User"],
        }),

        getUserSites: build.query<Array<string>, GetUserSitesT>({
            queryFn: async ({ token }: GetUserSitesT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/userSites`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
        }),

        getUserRoles: build.query<Array<string>, GetUserRolesT>({
            queryFn: async ({ token }: GetUserRolesT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/userRoles`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
        }),

        getUserManagementJobs: build.query<Array<ManagementJob>, GetUserManagementJobsT>({
            queryFn: async ({ token, username }: GetUserManagementJobsT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/users/${username}/managementJobs`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
        }),

        getUserManagementJobLogs: build.query<string, GetUserManagementJobLogsT>({
            queryFn: async ({ token, username, selectorUid }: GetUserManagementJobLogsT) => {
                try {
                    return {
                        data: await call("GET",
                            `${BASE_URL_API}/users/${username}/managementJobs/${selectorUid}`,
                            token ? new Map([["Authorization", "Bearer " + token]]) : null,
                            null, "text", null)
                    };
                } catch (error) { return { error: generateError(error) }; }
            },
        }),

  }),
});

export const {
    useGetUsersPageQuery,
    useGetUserQuery,
    usePutUserMutation,
    useGetUserSitesQuery,
    useGetUserRolesQuery,
    useGetUserManagementJobsQuery,
    useGetUserManagementJobLogsQuery,
    useLazyGetUserManagementJobLogsQuery

} = usersApi;

