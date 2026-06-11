import { useKeycloak } from "@react-keycloak/web";
import SiteEditor from "./SiteEditor";
import ErrorView from "../common/ErrorView";
import LoadingView from "../common/LoadingView";
interface SiteCreatorViewProps {
    keycloakReady : boolean;
}

export default function SiteCreatorView({keycloakReady}: SiteCreatorViewProps): JSX.Element {
    const {keycloak} = useKeycloak();

    return  <>
        {
            keycloakReady 
                ? <>{
                    keycloak.authenticated 
                    ? <SiteEditor  />
                    : <ErrorView message="Please authenticate to access this page." />

                }</>
                : <LoadingView what="page" />
        }
    </>

}