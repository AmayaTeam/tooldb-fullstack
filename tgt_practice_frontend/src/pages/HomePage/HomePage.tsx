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

    // State to trigger refetch in List.tsx
    const [refetchList, setRefetchList] = useState<boolean>(false);

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleRefetchList = () => {
        setRefetchList(prev => !prev); // Toggle the value to trigger refetch
    };

    if (loading) return <div>Loading...</div>;

    if (error || !data || !data.me) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container">
            <Header />
            <List onItemClick={handleItemClick} refetchTrigger={refetchList} />
            {selectedItemId && <Display selectedItemId={selectedItemId} onSave={handleRefetchList} />}
            {isShowingModal && <Modal />}
        </div>
    );
};

export default HomePage;
