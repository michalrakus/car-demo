import React, {useState} from 'react';
// import './App.css'; - tu bol povodne
import {XUtilsMetadata} from "@michalrakus/x-react-web-lib/XUtilsMetadata";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css'; // bol povodne ako prve css
import type {XPostLoginRequest} from "./serverApi/XPostLoginIfc";
import {Utils, XUserNotFoundOrDisabledError} from "./Utils";
import {XEnvVar} from "@michalrakus/x-react-web-lib/XEnvVars";

// TODO - move to lib
export const XAuth0Provider = ({children}: {children: React.ReactNode;}) => {
    // na fungovanie klienta stacili domain, clientId, redirectUri - tak som nechal len tie
    // a este som sem pridal audience (id-cko backend-u) aby pri prihlasovani pytal suhlas na scope "profile"
    // (bez toho pri getAccessTokenSilently vrati chybu "Consent required", v doku sa pise: user cannot provide consent during a non-interactive flow (like getAccessTokenSilently))
    // scope "profile" je pravdepodobne defaultny scope ktory sa vzdy vyzaduje
    // tu su dalsie atributy, ktore tu boli zapisane (audience, scope sa daju zapisat pri zavolani getAccessTokenSilently)
    // responseType="token id_token"
    // scope="openid profile admin:demo try:demo"
    // redirect_uri je url-ka, na ktoru sa flow vrati po logine z auth0.com (musi byt uvedena v configuracii aplikacie na auth0.com vo fielde Allowed Callback URLs)
    // (poznamka: mohli by sme pouzivat window.location.origin + "/callback" a na "/callback" v router-i zavesit specialny komponent ktory by sa cez navigate() dostal na spravnu stranku)
    //console.log('redirect_uri = ' + window.location.origin + window.location.pathname);
    return (
        <Auth0Provider
            domain={Utils.getEnvVarValue(XEnvVar.VITE_AUTH0_DOMAIN)}
            clientId={Utils.getEnvVarValue(XEnvVar.VITE_AUTH0_CLIENT_ID)}
            authorizationParams={{redirect_uri: window.location.origin, audience: Utils.getEnvVarValue(XEnvVar.VITE_AUTH0_AUDIENCE)}}>
            <AppAuth0>
                {children}
            </AppAuth0>
        </Auth0Provider>
    );
}

// TODO - v buducnosti presunut do XReactWebLib
function AppAuth0({children}: {children: React.ReactNode;}) {


    const {user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently} = useAuth0();

    const [initialized, setInitialized] = useState(false);

    // useEffect(() => {
    //     fetchAndSetXEntityMap();
    // },[]); // eslint-disable-line react-hooks/exhaustive-deps

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
                logout({logoutParams: {returnTo: window.location.origin}});
            }
            else {
                // ak bola ina chyba, aplikacia spadne
                throw err;
            }
        }
    }

    const setXTokenAndDoPostLogin = async () => {

        // const accessToken: string = await getAccessTokenSilently(/*{
        //     audience: Utils.getEnvVarValue(XEnvVar.VITE_AUTH0_AUDIENCE)
        //     //scope: "openid profile admin:demo try:demo" - treba nam na nieco?
        // }*/);

        // neviem ci tu je idealne miesto kde nastavit metodku getAccessToken, zatial dame sem
        XUtils.setXToken({accessToken: getAccessToken});

        // zavolame post-login
        // - overime ci je user zapisany v DB (toto sa da obist - TODO - poriesit)
        // - zosynchronizujeme zmeny (pre pripad ak sa zmenilo napr. Meno, Priezvisko) - TODO
        let xPostLoginResponse;
        try {
            const xPostLoginRequest: XPostLoginRequest = {username: user?.name};
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
            alert(`User account "${user?.email}" not found in DB. Login not permitted. Ask admin to create user account in DB.`);
            // pouzijeme custom exception ktoru neskor odchytime (krajsie riesenie ako vracat true/false)
            throw new XUserNotFoundOrDisabledError();
        }

        if (!xPostLoginResponse.xUser.enabled) {
            // user je disablovany
            alert(`User account "${user?.email}" is not enabled. Ask admin to enable user account.`);
            // pouzijeme custom exception ktoru neskor odchytime (krajsie riesenie ako vracat true/false)
            throw new XUserNotFoundOrDisabledError();
        }

        // ulozime si usera do access token-u - zatial take provizorne, user sa pouziva v preSave na setnutie vytvoril_id
        XUtils.setXToken({
            accessToken: XUtils.getXToken()?.accessToken,
            xUser: xPostLoginResponse.xUser,
            logout: () => logout({logoutParams: {returnTo: window.location.origin}})
        });

        console.log("App - bol uspesne zavolany setXTokenAndDoPostLogin");
    }

    const fetchAndSetXMetadata = async () => {
        await XUtilsMetadata.fetchAndSetXEntityMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXEntityMap()");
        await XUtilsMetadata.fetchAndSetXBrowseMetaMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXBrowseMetaMap()");
    }

    // tato funkcia sa vola pred kazdym requestom na backend - vola sa v metode XUtils.fetchBasic
    // ked sa vola len pri inicializacii, tak token po case (24h default) exspiruje a user si musi restartnut aplikaciu
    const getAccessToken = async (): Promise<string> => {

        return await getAccessTokenSilently(/*{
            audience: Utils.getEnvVarValue(XEnvVar.VITE_AUTH0_AUDIENCE)
            //scope: "openid profile admin:demo try:demo" - treba nam na nieco?
        }*/);
    }

    let elem: React.ReactNode;
    if (isLoading) {
        elem = <div className="App-form">User is being initialized using Auth0...</div>;
    }
    else {
        if (!isAuthenticated) {
            // otvori Auth0 prihlasovaciu stranku
            // window.location.pathname obsahuje path cast z volanej url-ky (napr. "/cars")
            // pri volani callback uri (navrat z auth0 do app-ky) zjavne automaticky pouzije tento ulozeny path
            loginWithRedirect({
                appState: { returnTo: window.location.pathname }
            });
            //elem = <div className="App-form"><button onClick={() => loginWithRedirect()}>Log In</button></div>;
        }
        else {
            if (!initialized) {
                elem = <div className="App-form">App is being initialized...</div>;
                initializeApp();
            }
            else {
                elem = children;
            }
        }
    }

    return elem;
}

export default AppAuth0;
