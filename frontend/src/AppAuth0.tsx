
import React, {useState} from 'react';
// import './App.css'; - tu bol povodne
import {XMenu} from "./XMenu";
import {XUtilsMetadata} from "@michalrakus/x-react-web-lib/XUtilsMetadata";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {useAuth0} from "@auth0/auth0-react";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css'; // bol povodne ako prve css
import {XPostLoginRequest} from "./serverApi/XPostLoginIfc";
import {XUserNotFoundOrDisabledError} from "./Utils";

// TODO - v buducnosti presunut do XReactWebLib
function AppAuth0() {


    const {user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently} = useAuth0();

    const [initialized, setInitialized] = useState(false);

    // useEffect(() => {
    //     fetchAndSetXEntityMap();
    // },[]); // eslint-disable-line react-hooks/exhaustive-deps

    const initializeApp = async () => {
        try {
            await getAndSetAccessToken();
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

    const getAndSetAccessToken = async () => {

        const accessToken: string = await getAccessTokenSilently(/*{
            audience: XUtils.getEnvVarValue(XEnvVar.REACT_APP_AUTH0_AUDIENCE)
            //scope: "openid profile admin:demo try:demo" - treba nam na nieco?
        }*/);

        // post-login potrebuje accessToken, preto ho uz tu setneme
        XUtils.setXToken({accessToken: accessToken});

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
        XUtils.setXToken({accessToken: accessToken, xUser: xPostLoginResponse.xUser});

        console.log("App - bol uspesne zavolany getAndSetAccessToken");
    }

    const fetchAndSetXMetadata = async () => {
        await XUtilsMetadata.fetchAndSetXEntityMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXEntityMap()");
        await XUtilsMetadata.fetchAndSetXBrowseMetaMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXBrowseMetaMap()");
    }

    let elem;
    if (isLoading) {
        elem = <div className="App-form">User is being initialized using Auth0...</div>;
    }
    else {
        if (!isAuthenticated) {
            // otvori Auth0 prihlasovaciu stranku
            loginWithRedirect();
            //elem = <div className="App-form"><button onClick={() => loginWithRedirect()}>Log In</button></div>;
        }
        else {
            if (!initialized) {
                elem = <div className="App-form">App is being initialized...</div>;
                initializeApp();
            }
            else {
                elem = <XMenu defaultFormElement={null} logout={() => logout({logoutParams: {returnTo: window.location.origin + window.location.pathname}})}/>;
            }
        }
    }

    return (
        <div className="App">
            {elem}
        </div>
    );
}

export default AppAuth0;
