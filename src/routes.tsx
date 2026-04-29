import { createBrowserRouter } from "react-router";

import App from "./App";
import { RouteWrapper } from "./features/auth/components/RouteWrapper/RouteWrapper";
import { HomePage } from "./features/posts/pages/HomePage/HomePage";
import { AboutPage } from "./features/about/pages/AboutPage";
import { LoginPage } from "./features/auth/pages/LoginPage/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage/RegisterPage";
import { PostDetailPage } from "./features/posts/pages/PostDetailPage/PostDetailPage";
import { CreatePostPage } from "./features/posts/pages/CreatePostPage/CreatePostPage";
import { DashboardPage } from "./features/posts/pages/DashboardPage/DashboardPage";
import { EditPostPage } from "./features/posts/pages/EditPostPage/EditPostPage";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "about",
                element: <AboutPage />
            },
            {
                path: "login",
                element: <RouteWrapper isPrivate={false}><LoginPage /></RouteWrapper>
            },
            {
                path: "register",
                element: <RouteWrapper isPrivate={false}><RegisterPage /></RouteWrapper>
            },
            {
                path: "post",
                children: [
                    { path: ":id", element: <RouteWrapper isPrivate={true}><PostDetailPage /></RouteWrapper> },
                    { path: ":id/edit", element: <RouteWrapper isPrivate={true}><EditPostPage /></RouteWrapper> },
                    { path: "create", element: <RouteWrapper isPrivate={true}><CreatePostPage /></RouteWrapper> }
                ]
            },
            {
                path: "dashboard",
                element: <RouteWrapper isPrivate={true}><DashboardPage /></RouteWrapper>
            }
        ],
    },
]);