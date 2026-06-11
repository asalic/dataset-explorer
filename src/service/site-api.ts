import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type EndpointBuilder } from "@reduxjs/toolkit/query";
import type SiteShort from "../model/site/SiteShort";
import config from "./config";
import UrlFactory from "./UrlFactory";
import type Site from "../model/site/Site";


export const apiSites = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: config.datasetService.api }),
  reducerPath: 'siteApi',
  refetchOnMountOrArgChange: false,
  tagTypes: ["SitesList", "Site"],
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

interface GetSitesT {
    token: string | null | undefined;
}

interface GetSiteT {
    token: string | null | undefined;
    siteCode: string;
}

interface PutSiteT {
    token: string | null | undefined;
    site: Site;

}

export const {
    usePutSiteMutation,
    useGetSitesQuery,
    useGetSiteQuery,
    useLazyGetSitesQuery,
} = apiSites;
