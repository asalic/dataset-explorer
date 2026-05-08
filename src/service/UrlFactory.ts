import SingleDataType from "../model/SingleDataType";
import Util from "../Util";
import config from "../service/config";
import UserView from "../components/users/user/UserView";
import UrlTags from "../model/UrlTags";

/**
 * TO BE USED WITH THE REACT ROUTER (navigate, Link etc.)
 * this class generates various links used around the web app, EXCEPT those used to call the API
 */
export default class UrlFactory {

    static baseName = config.basename.endsWith("/") ? config.basename.substring(0, config.basename.length - 1) : config.basename;
    //static base = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}${UrlFactory.base()}`;

    public static base() {
        return UrlFactory.baseName;
    }
    public static singleData(singleDataType: SingleDataType, queryParams?: UrlTags): string { 
        return `${UrlFactory.base()}/${Util.singleDataPath(singleDataType)}${UrlFactory.queryParams(queryParams)}`;
    }
    public static singleDataDetails(id: string, singleDataType: SingleDataType): string {
        return `${UrlFactory.singleData(singleDataType)}/${id}/details`
    }

    public static sites(): string { return `${UrlFactory.base()}/sites`}

    public static getPutSite(siteCode: string): string { return `${UrlFactory.base()}/sites/${siteCode}`;}

    public static siteCreator(): string { return `${UrlFactory.base()}/sites/creator`; }

    public static projectDetails(code: string): string {
        return `${UrlFactory.base()}/projects/${code}/details`
    }

    public static projectNew():  string {
        return `${UrlFactory.base()}/projects/new`;
    }

    public static projects(): string {
        return `${UrlFactory.base()}/projects`;
    }

    public static subprojectEditor(code: string, subcode: string): string 
        {return `${UrlFactory.base()}/projects/${code}/subprojects/${subcode}/editor`;}

    public static subprojectNew(code: string): string 
        {return `${UrlFactory.base()}/projects/${code}/subprojects/new`;}

    public static projectConfigEdit(code: string): string {
        return `${UrlFactory.base()}/projects/${code}/config-editor`;
    }

    public static projectLogoFullUrl(logoUrl: string): string {
        return `${config.datasetService.projectLogo}${logoUrl}`;
        // const url: URL | null = URL.parse(Config.datasetService.api);
        // if (url) {
        //     return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${Config.base()}${logoUrl}`
        // } else {
        //     return `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}${Config.base()}${logoUrl}`
        // }
    }

    public static users(): string { return `${UrlFactory.base()}/users`;}

    public static userBase(username: string): string {
        return `${UrlFactory.base()}/users/${username}`;
    }
    public static userDetails(username: string): string {
        return `${this.userBase(username)}/${UserView.TAB_DETAILS}`;
    }
    public static userLogs(username: string): string {
        return `${this.userBase(username)}/${UserView.TAB_LOGS}`;
    }

    public static fair(): string { return `${UrlFactory.base()}/fair`; }

    public static support(): string { return `${UrlFactory.base()}/support`; }

    public static queryParams(qps?: UrlTags): string {
        if (qps) { 
            let qpA = [];
            for (const [k, v] of Object.entries(qps)) {
                qpA.push(`${k}=${v}`);
            }
            return `?${qpA.join("&")}`;
        } else {
            return "";
        }
    }
}

