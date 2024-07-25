import React from 'react';
import './Modal.css';

interface ModalProps {
    onClose: () => void;
    message: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, message }) => {
    return (
        <div className="modal">
            <div className="modal-content">
            <p>{message}</p>
                <button className="close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;