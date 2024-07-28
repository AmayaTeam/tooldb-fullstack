import React from 'react';

interface MessageModalProps {
    message: string;
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {

    return (
        <div className="modal-content">
            <h2>{message}</h2>
            <div className="modal-buttons">
                <button onClick={onClose}>Ok</button>
            </div>
        </div>
    );
};

export default MessageModal;