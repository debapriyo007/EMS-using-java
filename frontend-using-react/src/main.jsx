import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import ToastProvider from "./Components/ToastProvider";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App/>
    </ToastProvider>
  </React.StrictMode>
)
