import React, { useState } from "react";
import Header from "../../components/header/Header.tsx";
import List from "../../components/list/List.tsx";
import Display from "../../components/display/Display.tsx";
import Modal from "src/components/Modal/Modal.tsx";
import GET_CURRENT_USER from '../../graphql/queries/get_current_user';
import { useQuery } from '@apollo/client';
import { Navigate } from "react-router-dom";
import { useModal } from "src/contexts/ModalContext.tsx";

const HomePage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_CURRENT_USER);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const { isShowingModal } = useModal();

    const [csvAnalysisResult, setCsvAnalysisResult] = useState<any>(null);

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleCsvFileProcessed = (data: any) => {
        console.log(data)
        setCsvAnalysisResult(data);
    };

    if (loading) return <div>Loading...</div>;
    if (error || !data || !data.me) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container">
            <Header onFileProcessed={handleCsvFileProcessed} />

            <List onItemClick={handleItemClick} />

            <Display selectedItemId={selectedItemId} csvAnalysisResult={csvAnalysisResult} />
            {isShowingModal && <Modal />}
        </div>
    );
};

export default HomePage;
