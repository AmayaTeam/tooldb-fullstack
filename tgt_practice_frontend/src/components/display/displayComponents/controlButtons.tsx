import React from "react";

interface ControlButtonsProps {
    handleSave: () => void;
    handleUndoChanges: () => void;
    role: string | undefined;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ handleSave, handleUndoChanges, role }) => (
    role === "Manager" ? (
        <div className="display-content-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleUndoChanges}>Undo Changes</button>
        </div>
    ) : null
);

export default ControlButtons;
