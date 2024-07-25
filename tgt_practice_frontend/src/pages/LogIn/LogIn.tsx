// Ваш компонент LogIn.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import GET_CURRENT_USER from '../../graphql/queries/get_current_user';
import LogInWindow from "../../components/LogInWindow/LogInWindow.tsx";


const LogIn: React.FC = () => {
    const { loading, data } = useQuery(GET_CURRENT_USER);

    if (loading) return <div>Loading...</div>;

    // Check if the user is logged in and redirect to home
    if (data && data.me) {
        return <Navigate to="/home" replace />;
    }

    return <LogInWindow />;
};

export default LogIn;
