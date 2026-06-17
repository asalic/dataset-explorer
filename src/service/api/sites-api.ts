import { type EndpointBuilder } from "@reduxjs/toolkit/query";
import type SiteShort from "../../model/site/SiteShort";
import UrlFactory from "../UrlFactory";
import type Site from "../../model/site/Site";
import {api} from "./api"
import { GetSitesT, GetSiteT, PutSiteT } from "./sites-api-types";

export const sitesApi = api.injectEndpoints({
  endpoints: (build:  EndpointBuilder<any, any, any>) => ({
    getSites: build.query<Array<SiteShort>, GetSitesT>({
        query: ({token}) => ({
            url: UrlFactory.sites(),
            headers: {"Authorization": `Bearer ${token}`}
        }),
        providesTags: ["SitesList"],
    }),

    getSite: build.query<Site, GetSiteT>({
        query: ({token, siteCode}) => ({
            url: UrlFactory.getPutSite(siteCode),
            headers: {"Authorization": `Bearer ${token}`}
        }),
        providesTags: ["Site"],
    }),

    putSite: build.mutation<void, PutSiteT>({
        query: ({token, site}) => ({
                url: UrlFactory.getPutSite(site.code),
                method: "PUT",
                body: site,
                headers: {"Authorization": `Bearer ${token}`}
            }),
            invalidatesTags: ["SitesList", "Site"],
        }),

  }),
})

export const {
    usePutSiteMutation,
    useGetSitesQuery,
    useGetSiteQuery,
    useLazyGetSitesQuery,
} = sitesApi;
