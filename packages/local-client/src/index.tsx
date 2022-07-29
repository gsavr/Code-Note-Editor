import "bulmaswatch/darkly/bulmaswatch.min.css";
//import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style/index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { App } from "./components/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //@ts-ignore
  <Provider store={store.default}>
    <App />
  </Provider>
);
