import SingleDataType from "../model/SingleDataType";
import Util from "../Util";
import config from "../service/config";
import UserView from "../components/users/user/UserView";
import type UrlTags from "../model/UrlTags";

/**
 * TO BE USED WITH THE REACT ROUTER (navigate, Link etc.)
 * this class generates various links used around the web app, EXCEPT those used to call the API
 */
export default class UrlFactory {

    static baseName = config.basename.endsWith("/") ? config.basename.substring(0, config.basename.length - 1) : config.basename;
    //static base = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`;

    public static base() {
        return UrlFactory.baseName;
    }
    public static singleData(singleDataType: SingleDataType, queryParams?: UrlTags): string { 
        return `/${Util.singleDataPath(singleDataType)}${UrlFactory.queryParams(queryParams)}`;
    }
    public static singleDataDetails(id: string, singleDataType: SingleDataType): string {
        return `${UrlFactory.singleData(singleDataType)}/${id}/details`
    }

    public static datasetNew() {
        return "/datasets/new";
    }

    public static sites(): string { return `/sites`}

    public static getPutSite(siteCode: string): string { return `/sites/${siteCode}`;}

    public static siteCreator(): string { return `/sites/creator`; }

    public static projectDetails(code: string): string {
        return `/projects/${code}/details`
    }

    public static projectNew():  string {
        return `/projects/new`;
    }

    public static projects(): string {
        return `/projects`;
    }

    public static subprojectEditor(code: string, subcode: string): string 
        {return `/projects/${code}/subprojects/${subcode}/editor`;}

    public static subprojectNew(code: string): string 
        {return `/projects/${code}/subprojects/new`;}

    public static projectConfigEdit(code: string): string {
        return `/projects/${code}/config-editor`;
    }

    public static users(): string { return `/users`;}

    public static userBase(username: string): string {
        return `/users/${username}`;
    }
    public static userDetails(username: string): string {
        return `${this.userBase(username)}/${UserView.TAB_DETAILS}`;
    }
    public static userLogs(username: string): string {
        return `${this.userBase(username)}/${UserView.TAB_LOGS}`;
    }

    public static fair(): string { return `/fair`; }

    public static support(): string { return `/support`; }

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

