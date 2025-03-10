import { ReactKeycloakProvider } from "@react-keycloak/web";
import type {
  AuthClientEvent,
  AuthClientError
} from '@react-keycloak/core'
import keycloakConfig from './keycloak';
import  React, { useState, useCallback } from "react";
import config from "./service/config";

import App from "./App";

function AppKeycloak() {

    const [keycloakReady, setKeycloakReady] = useState(false);
      // const [keycloakProviderInitConfig, setKeycloakProviderInitConfig] = useState(
  //   {"redirectUri": window.location.href});
  const onEvent = useCallback((event?: AuthClientEvent | null, error?: AuthClientError | undefined ) => {
    //console.log('onKeycloakEvent', event);
          if (event && (event === 'onReady')) {
              setKeycloakReady(true);
          }
          if (error) {
            console.error(error);
            setKeycloakReady(true);
            //postMessage(new Message(Message.ERROR, "Keycloak provider error", error.error))
          }
          //console.log('keycloak ready', keycloakReady);
  }, []);

  const tokenLogger = (tokens?: any) => {
    console.log('onKeycloakTokens');//, tokens)
  }

    return (
        <ReactKeycloakProvider authClient={keycloakConfig}
          initOptions={config.keycloak.initOptions}
          onEvent={onEvent}
          onTokens={tokenLogger}
          // initOptions={{
          //           adapter: "default",
          //       }}
          //      LoadingComponent={<Loading />}
          ><App keycloakReady={keycloakReady}/></ReactKeycloakProvider>
    );
}

export default AppKeycloak;