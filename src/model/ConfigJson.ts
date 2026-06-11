import type ExternalService from "./ExternalService";

interface KeycloakConfigOptions {
    responseMode: string;
    checkLoginIframe: boolean;
    onLoad: string;
}

interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

interface KeycloakOpts {
    config: KeycloakConfig;
    initOptions: KeycloakConfigOptions;
}

interface DatasetService {
    api:  string;
    projectLogo: string;
}

interface ExternalLinks {
    supportReportRequest: string;
    applicationCatalogue?: string;
    datasetUsageGuide: string;
    workstationUsageGuide: string;
    appIntegration: string;
}

interface Project {
    name: string;
    doi?: string | null;
    termsConditions?: string |  null;
    privacyPolicy?: string |  null;
    favicon: string;
    sla?: string |  null;
}

export default interface ConfigJson {

    appVersion: string;
    release: string;
    publicURL?: string | null;
    datasetService: DatasetService;
    tracerService?: string | null;
    caseExplorer?: ExternalService | null;
    basename: string;
    defaultLimitDatasets: number;
    defaultLimitStudies: number;
    defaultLimitTraces: number;
    defaultLimitAccess: number;
    defaultLimitUsers: number;
    userAccountUrl: string;
    refreshDatasetCreate: number;
    keycloak: KeycloakOpts;
    externalLinks: ExternalLinks;
    project: Project;
    externalServices?: ExternalService[];
    appsDashboard: string;

}