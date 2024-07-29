import React from 'react';

interface TypeDeletionModalProps {
    onClose: () => void;
    onSubmit: () => void;
}

const TypeDeletionModal: React.FC<TypeDeletionModalProps> = ({ onClose, onSubmit }) => {
    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="modal-content">
            <h2>Delete type?</h2>
            <div className="modal-buttons">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default TypeDeletionModal;