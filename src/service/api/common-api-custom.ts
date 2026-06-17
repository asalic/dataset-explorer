import { useState } from "react";
import type MutationHookLike from "../../model/MutationHookLike";
import type Logo from "../../model/project/Logo";
import LogoType from "../../model/project/LogoType";
import { usePatchProjectMutation, usePutProjectLogoMutation } from "./projects-api";
import Util from "../../Util";

// type Upload = PutProjectLogoT & {
//     type: LogoType;
// }

// type External = PutProjectT & {
//     type: LogoType;
// }

// type SaveArgs = External | Upload;

type SaveArgs = {
    token: string;
    code: string;
    property: "logoUrl";
    value: Logo;
}


export function useSaveProject(): MutationHookLike<SaveArgs, boolean | undefined> {
    const [uploadTrigger, uploadState] = usePutProjectLogoMutation();
    const [updateTrigger, updateState] = usePatchProjectMutation();
    const [localError, setLocalError] = useState<Error | null>(null);

    const trigger = async (args: SaveArgs) => {
        uploadState.reset();
        updateState.reset();
        setLocalError(null);
        if (args.value.type === LogoType.UPLOAD_IMAGE) {
            return uploadTrigger({ token: args.token, code: args.code, 
                logo: args.value.logo ? args.value.logo as File : null }).unwrap();
        } else if (args.value.type === LogoType.EXTERNAL_LINK) {
            if (!Util.isValidUrl(args.value.logo)) {
                const err = new Error(`The logo's external link is an invalid URL.`);
                setLocalError(err);
                throw err;
            }
            return updateTrigger({ token: args.token, code: args.code, property: "logoUrl", value: args.value.logo 
                ? args.value.logo as string : ""}).unwrap();
        } else if (args.value.type === LogoType.NONE) {
            return updateTrigger({ token: args.token, code: args.code, property: "logoUrl", value: ""}).unwrap();
        } else {
            const err = new Error(`Invalid logo type ${args.value.type} (contact the developers).`);
            setLocalError(err);
            throw err;
        }

    };

    const mergedState = {
        data: uploadState.data ?? updateState.data,
        error: localError ?? uploadState.error ?? updateState.error,
        isLoading: uploadState.isLoading || updateState.isLoading,
        isSuccess: uploadState.isSuccess || updateState.isSuccess,
        isError: !!localError || uploadState.isError || updateState.isError,
        reset: () => {
            uploadState.reset();
            updateState.reset();
        }
    };

    return [trigger, mergedState];
}
