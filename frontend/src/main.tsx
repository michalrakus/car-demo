import ReactDOM from "react-dom/client";
import './index.css';
import * as serviceWorker from './serviceWorker';
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {setLocale} from "./Locale";
import {Utils} from "./Utils.tsx";
import {XApp} from "./XApp.tsx";
import {CarDemoRouterProvider} from "./CarDemoRouterProvider.tsx";

XUtils.initLib(Utils.getEnvVarValue);

setLocale();

const container = document.getElementById("root");
if (container !== null) {
    const root = ReactDOM.createRoot(container);
    root.render(<XApp><CarDemoRouterProvider/></XApp>);
}
else {
    console.log('element with id="root" not found');
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
