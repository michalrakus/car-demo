
import React, {useState} from 'react';
// import './App.css'; - tu bol povodne
import {XMenu} from "./XMenu";
import {XUtilsMetadata} from "@michalrakus/x-react-web-lib/XUtilsMetadata";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css'; // bol povodne ako prve css
import {XPostLoginRequest} from "./serverApi/XPostLoginIfc";
import {XUserNotFoundOrDisabledError} from "./Utils";
import {
    IMsalContext,
    useIsAuthenticated,
    useMsal
} from "@azure/msal-react";
import {AuthenticationResult, IPublicClientApplication, SilentRequest, AccountInfo} from "@azure/msal-browser";
import {loginRequest} from "./msalConfig";
import {Button} from "primereact/button";

// TODO - v buducnosti presunut do XReactWebLib
function AppMSEntraID() {

    const isAuthenticated = useIsAuthenticated();
    const msalContext: IMsalContext = useMsal();
    const msalInstance: IPublicClientApplication = msalContext.instance;
    const accounts: AccountInfo[] = msalContext.accounts;

    const [initialized, setInitialized] = useState(false);

    const initializeApp = async () => {
        try {
            await setXTokenAndDoPostLogin();
            await fetchAndSetXMetadata();
            // vsetko zbehlo, app-ka je inicializovana
            setInitialized(true);
        }
        catch (err) {
            if (err instanceof XUserNotFoundOrDisabledError) {
                // prihlasil sa napr. gmail user, ktory nie je uvedeny v DB
                // zrusime nastaveny access token
                XUtils.setXToken(null);
                // odhlasime uzivatela
                //msalInstance.logoutRedirect();
                logoutWithRedirect();
            }
            else {
                // ak bola ina chyba, aplikacia spadne
                throw err;
            }
        }
    }

    const setXTokenAndDoPostLogin = async () => {

        // neviem ci tu je idealne miesto kde nastavit metodku getAccessToken, zatial dame sem
        XUtils.setXToken({accessToken: getAccessToken});

        //const accountInfo = msalInstance.getActiveAccount();
        //const accountInfo = msalInstance.getAllAccounts()[0];
        const accountInfo = accounts[0];

        // zavolame post-login
        // - overime ci je user zapisany v DB (toto sa da obist - TODO - poriesit)
        // - zosynchronizujeme zmeny (pre pripad ak sa zmenilo napr. Meno, Priezvisko) - TODO
        let xPostLoginResponse;
        try {
            const xPostLoginRequest: XPostLoginRequest = {username: accountInfo?.username};
            xPostLoginResponse = await XUtils.fetch('post-login', xPostLoginRequest);
        }
        catch (e) {
            // console.log(typeof e);
            // console.log(e instanceof Error);
            const error: Error = e as Error;
            // console.log(JSON.stringify(error));
            console.log(error.stack);
            // console.log(error.message);
            // console.log(error.name);
            console.log(error.cause);

            XUtils.showErrorMessage('post-login failed', e);
            throw 'post-login failed';
        }

        if (xPostLoginResponse.xUser === undefined) {
            // nenasli sme usera v DB
            alert(`User account "${accountInfo?.username}" not found in DB. Login not permitted. Ask admin to create user account in DB.`);
            // pouzijeme custom exception ktoru neskor odchytime (krajsie riesenie ako vracat true/false)
            throw new XUserNotFoundOrDisabledError();
        }

        if (!xPostLoginResponse.xUser.enabled) {
            // user je disablovany
            alert(`User account "${accountInfo?.username}" is not enabled. Ask admin to enable user account.`);
            // pouzijeme custom exception ktoru neskor odchytime (krajsie riesenie ako vracat true/false)
            throw new XUserNotFoundOrDisabledError();
        }

        // ulozime si usera do access token-u - zatial take provizorne, user sa pouziva v preSave na setnutie vytvoril_id
        XUtils.setXToken({accessToken: XUtils.getXToken()?.accessToken, xUser: xPostLoginResponse.xUser});

        //console.log("App - bol uspesne zavolany getAndSetAccessToken");
    }

    const fetchAndSetXMetadata = async () => {
        await XUtilsMetadata.fetchAndSetXEntityMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXEntityMap()");
        await XUtilsMetadata.fetchAndSetXBrowseMetaMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXBrowseMetaMap()");
    }

    const loginWithRedirect = async () => {

        try {
            console.log("loginWithRedirect: ideme volat msalInstance.loginRedirect");
            await msalInstance.loginRedirect(loginRequest);
        }
        catch (err) {
            console.error('Error in loginWithRedirect: ', err);
            //alert(err);
            throw err;
        }
    }

    const logoutWithRedirect = async () => {
        const logoutRequest = {
            //account: msalInstance.getAccountByHomeId(homeAccountId),
            account: accounts[0],
            postLogoutRedirectUri: window.location.origin + window.location.pathname
        };
        await msalInstance.logoutRedirect(logoutRequest);
    }

    // tato funkcia sa vola pred kazdym requestom na backend - vola sa v metode XUtils.fetchBasic
    // ked sa vola len pri inicializacii, tak token po 1 hodine exspiruje a user si musi restartnut aplikaciu
    // acquireTokenSilent ziskava token zo sessionStorage (pozri msalConfig), ak po hodine vyexspiruje, tak ziska novy access token
    const getAccessToken = async (): Promise<string> => {

        const silentRequest: SilentRequest = {
            ...loginRequest,
            account: accounts[0],
        }

        //console.log("sme pred msalInstance.acquireTokenSilent");
        const authenticationResult: AuthenticationResult = await msalInstance.acquireTokenSilent(silentRequest);

        return authenticationResult.accessToken;
    }

    let elem;
    // if (msalContext.inProgress) {
    //     elem = <div className="App-form">User is being initialized using Azure AD...</div>;
    // }
    // else {
        if (!isAuthenticated) {
            //if (msalInstance.getAllAccounts().length === 0) {
            //loginWithRedirect();
            elem = <div className="App-form"><Button onClick={loginWithRedirect}>Log In</Button></div>;
        }
        else {
            if (!initialized) {
                elem = <div className="App-form">App is being initialized...</div>;
                console.log("ideme do initializeApp()");
                initializeApp();
            }
            else {
                elem = <XMenu defaultFormElement={null} logout={logoutWithRedirect}/>;
            }
        }
    // }

    return (
        <div className="App">
            {elem}
        </div>
    );
}

export default AppMSEntraID;
