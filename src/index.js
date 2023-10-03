import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// create a client
const queryClient = new QueryClient();

root.render(
  <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <App />
            <Notifications />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
