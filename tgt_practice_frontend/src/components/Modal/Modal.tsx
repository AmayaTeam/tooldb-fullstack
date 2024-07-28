import React from 'react';
import './Modal.css';
import { useModal } from 'src/contexts/ModalContext';


const Modal: React.FC = () => {
    const { modalContent } = useModal();

    return (
        <div className="modal">
            {modalContent}
        </div>
    );
};

export default Modal;