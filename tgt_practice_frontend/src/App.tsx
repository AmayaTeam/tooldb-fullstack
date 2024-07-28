import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import client from './lib/apolloClient';
import LogIn from "./pages/LogIn/LogIn.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import './App.css';

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
