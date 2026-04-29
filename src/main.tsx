import "./styles/globalStyle.scss"
import "./styles/themes.scss"
import "./firebase/config.tsx"

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import { routes } from "./routes";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={routes} />
    </StrictMode>
);