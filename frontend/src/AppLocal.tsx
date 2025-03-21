import React, {useState} from 'react';
// import './App.css'; - tu bol povodne
import {XMenu} from "./XMenu";
import {XUtilsMetadata} from "@michalrakus/x-react-web-lib/XUtilsMetadata";
import {XLoginForm} from "@michalrakus/x-react-web-lib/XLoginForm";
import useXToken from "@michalrakus/x-react-web-lib/lib/components/useXToken";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css'; // bol povodne ako prve css

// TODO - v buducnosti presunut do XReactWebLib
function AppLocal() {

    const [xToken, setXToken] = useXToken();

    const [initialized, setInitialized] = useState(false);

    // useEffect(() => {
    //     fetchAndSetXEntityMap();
    // },[]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAndSetXMetadata = async () => {
        await XUtilsMetadata.fetchAndSetXEntityMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXEntityMap()");
        await XUtilsMetadata.fetchAndSetXBrowseMetaMap();
        console.log("App - bol zavolany XUtilsMetadata.fetchAndSetXBrowseMetaMap()");
        setInitialized(true);
    }

    let elem;
    if (xToken === null) {
        elem = <div className="App-form"><XLoginForm setXToken={setXToken}/></div>;
    }
    else {
        if (!initialized) {
            elem = <div className="App-form">App is being initialized...</div>;
            fetchAndSetXMetadata();
        }
        else {
            elem = <XMenu defaultFormElement={null} logout={() => {setXToken(null);}}/>;
        }
    }

    return (
        <div className="App">
            {elem}
        </div>
    );
}

export default AppLocal;
