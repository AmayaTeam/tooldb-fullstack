import React from 'react';

interface GroupDeletionModal {
    onClose: () => void;
    onSubmit: () => void;
}

const GroupDeletionModal: React.FC<GroupDeletionModal> = ({ onClose, onSubmit }) => {
    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="modal-content">
            <h2>Delete group?</h2>
            <div className="modal-buttons">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default GroupDeletionModal;