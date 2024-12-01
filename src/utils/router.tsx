import ProtectedRoute from "@/components/custom/protected-route";
import Admin from "@/components/pages/admin";
import AddTask from "@/components/pages/add-task";
import Home from "@/components/pages/home";
import Login from "@/components/pages/login";
import Manage from "@/components/pages/manage";
import Tasks from "@/components/pages/tasks";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute disallowedRole="ROLE_Admin">
                <Home />
            </ProtectedRoute>
        )
    },
    {
        path: "/tasks",
        element: (
            <ProtectedRoute disallowedRole="ROLE_Admin">
                <Tasks />
            </ProtectedRoute>
        )
    },
    {
        path: "/tasks/add",
        element: (
            <ProtectedRoute disallowedRole="ROLE_Admin">
                <AddTask />
            </ProtectedRoute>
        )
    },
    {
        path: "/manage",
        element: (
            <ProtectedRoute allowedRole="ROLE_Manager">
                <Manage />
            </ProtectedRoute>
        )
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRole="ROLE_Admin">
                <Admin />
            </ProtectedRoute>
        )
    },
    {
        path: "/login",
        element: (
            <Login />
        )
    }
]);

export default router;