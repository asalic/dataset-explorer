import Site from "../../model/site/Site";

export interface GetSitesT {
    token: string | null | undefined;
}

export interface GetSiteT {
    token: string | null | undefined;
    siteCode: string;
}

export interface PutSiteT {
    token: string | null | undefined;
    site: Site;

}