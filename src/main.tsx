import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider, darkTheme } from "@adobe/react-spectrum";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider theme={darkTheme} height="100%" scale="medium">
      <App />
    </Provider>
  </React.StrictMode>
);
