import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from "@auth0/auth0-react";
import AppAuth0 from "./AppAuth0";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {XEnvVar, XReactAppAuth} from "@michalrakus/x-react-web-lib/XEnvVars";
import {setLocale} from "./Locale";
import {MsalProvider} from "@azure/msal-react";
import {PublicClientApplication} from "@azure/msal-browser";
import AppMSEntraID from "./AppMSEntraID";
import {msalConfig} from "./msalConfig";
import AppAuthOff from "./AppAuthOff";

// TODO - supni do XUtils.setXBackendUrl
let backendUrl: string = XUtils.getEnvVarValue(XEnvVar.REACT_APP_BACKEND_URL);
if (!backendUrl.endsWith('/')) {
    backendUrl += '/';
}
XUtils.setXBackendUrl(backendUrl);
//XUtils.setXBackendUrl(XUtils.getEnvVarValue(XEnvVar.REACT_APP_BACKEND_URL));
setLocale();

let rootElem: any;
if (XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH) === XReactAppAuth.OFF) {
    rootElem =
        <React.StrictMode>
            <AppAuthOff />
        </React.StrictMode>;
}
else if (XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH) === XReactAppAuth.LOCAL) {
    /* username/password authentication
    rootElem =
        <React.StrictMode>
            <AppLocal />
        </React.StrictMode>;
     */
}
else if (XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH) === XReactAppAuth.AUTH0) {
    // na fungovanie klienta stacili domain, clientId, redirectUri - tak som nechal len tie
    // a este som sem pridal audience (id-cko backend-u) aby pri prihlasovani pytal suhlas na scope "profile"
    // (bez toho pri getAccessTokenSilently vrati chybu "Consent required", v doku sa pise: user cannot provide consent during a non-interactive flow (like getAccessTokenSilently))
    // scope "profile" je pravdepodobne defaultny scope ktory sa vzdy vyzaduje
    // tu su dalsie atributy, ktore tu boli zapisane (audience, scope sa daju zapisat pri zavolani getAccessTokenSilently)
    // responseType="token id_token"
    // scope="openid profile admin:demo try:demo"
    //console.log('redirect_uri = ' + window.location.origin + window.location.pathname);
    rootElem =
        <Auth0Provider
            domain={XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH0_DOMAIN)}
            clientId={XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH0_CLIENT_ID)}
            authorizationParams={{redirect_uri: window.location.origin + window.location.pathname, audience: XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH0_AUDIENCE)}}>
            <AppAuth0/>
        </Auth0Provider>;
}
else if (XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH) === XReactAppAuth.MS_ENTRA_ID) {

    const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig);

    //console.log("kontrola msalConfig.auth.redirectUri **************");
    //console.log(msalConfig.auth.redirectUri);

    rootElem =
        <MsalProvider instance={msalInstance}>
            <AppMSEntraID />
        </MsalProvider>
}

const container = document.getElementById("root");
if (container !== null) {
    const root = ReactDOMClient.createRoot(container);
    root.render(rootElem);
}
else {
    console.log('element with id="root" not found');
}

// *** disabling Back button in browser - start
window.history.pushState(null, document.title, window.location.href);
window.addEventListener('popstate', function (event)
{
    window.history.pushState(null, document.title, window.location.href);
});
// *** disabling Back button in browser - end

//ReactDOM.render(rootElem, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
