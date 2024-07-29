import React, { useState } from 'react';

interface ModuleCreationModalProps {
  onClose: () => void;
  onSubmit: (moduleName: string, moduleSerialNumber: string) => void;
}

const ModuleCreationModal: React.FC<ModuleCreationModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');


  const handleSubmit = () => {
    onSubmit(name, serialNumber);
    setName('');
    setSerialNumber('');
    onClose();
  };

  return (
    <div className="modal-content">
      <h2>Enter a new module data:</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Module name"
      />
      <input
        type="text"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Serial number"
      />
      <div className="modal-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ModuleCreationModal;