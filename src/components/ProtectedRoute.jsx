import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const token = getCookie("token");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;
