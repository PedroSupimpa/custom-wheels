import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/dashboard"));
const RoulettePage = lazy(() => import("../pages/roulettePage"));

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/:url",
        element: <RoulettePage />,
    },
];

export default routes;
