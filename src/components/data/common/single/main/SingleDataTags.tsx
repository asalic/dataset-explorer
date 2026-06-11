import { useKeycloak } from "@react-keycloak/web";
import SingleDataType from "../../../../../model/SingleDataType";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import TagComponent from "../../../../common/tag/TagComponent";
import GenericFieldEdit from "../../../../common/fieldedit/GenericFieldEdit";
import SingleDataFactory from "../../../../../api/SingleDataFactory";
import BodyFactorySpecType from "../../../../../model/BodyFactorySpecType";
import { useGetSingleDataQuery, usePatchSingleDataMutation } from "../../../../../service/singledata-api";

interface SingleDataTagsProps {
    singleDataId: string;
    keycloakReady: boolean;
    singleDataType: SingleDataType;
    showDialog: Function;
}

export default function SingleDataTags({ singleDataId, keycloakReady, singleDataType, showDialog }: SingleDataTagsProps) {
    const { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetSingleDataQuery({
        token: keycloak.token,
        id: singleDataId,
        singleDataType: singleDataType
    },
        {
            skip: !keycloakReady
        }
    )
    if (isLoading) {
        return <LoadingView what={`resource ID '${singleDataId}'`} />;
    } else if (isError) {
        return <ErrorView message={`Error loading resource ID '${singleDataId}': ${error.message ?? ""}`} />
    } else if (data && data.tags) {
        return <div>
            {
            data.tags.map(t => <TagComponent text={t} key={t} isClickable={true} />)
            }
            {
                data.tags.length === 0 ? <i className="px-2 bg-light">No tags available.</i> : null
            }
            {
                data.editablePropertiesByTheUser.includes("tags") && keycloakReady && keycloak.authenticated
                    ?  <>

                        <GenericFieldEdit
                            oldValue={data?.tags} field="tags" 
                            keycloakReady={keycloakReady} 
                            fieldDisplay={`${SingleDataFactory.getTypeName(singleDataType)} tags`}
                            showDialog={showDialog}
                            patchMutation={usePatchSingleDataMutation}
                            patchExternalFields={{
                                id: data.id,
                                singleDataType
                            }}
                            spec={BodyFactorySpecType.SINGLEDATA}/>
                    </>
                : <></>
            }
        </div>
    } else {
        return <></>;
    }

}