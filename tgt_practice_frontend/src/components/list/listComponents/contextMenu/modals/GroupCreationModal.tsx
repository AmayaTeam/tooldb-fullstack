import React, { useState } from 'react';

interface GroupCreationModalProps {
  onClose: () => void;
  onSubmit: (newGroupName: string) => void;
}

const GroupCreationModal: React.FC<GroupCreationModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');


  const handleSubmit = () => {
    onSubmit(name);
    setName('');
    onClose();
  };

  return (
    <div className="modal-content">
      <h2>Enter a new group name:</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <div className="modal-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default GroupCreationModal;