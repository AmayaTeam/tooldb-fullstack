import React, { useState } from "react";
import Header from "../../components/header/Header.tsx";
import List from "../../components/list/List.tsx";
import Display from "../../components/display/Display.tsx";
import { useQuery } from '@apollo/client';
import GET_CURRENT_USER from '../../graphql/queries/get_current_user';
import { Navigate } from "react-router-dom";
import Modal from "src/components/Modal/Modal.tsx";
import { useModal } from "src/contexts/ModalContext.tsx";

const HomePage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_CURRENT_USER);

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState('');

    const { isShowingModal } = useModal();

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    if (loading) return <div>Loading...</div>;

    if (error || !data || !data.me) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container">
            <Header setSelectedUnitId={setSelectedUnitId} />

            <List onItemClick={handleItemClick} />

            <Display selectedItemId={selectedItemId} selectedUnitId={selectedUnitId} />
            {isShowingModal && <Modal />}
        </div>
    );
};

export default HomePage;