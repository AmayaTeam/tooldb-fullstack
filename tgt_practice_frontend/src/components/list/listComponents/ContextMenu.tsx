import React from 'react';
import "../List.css"
interface ContextMenuProps {
    x: number;
    y: number;
    options: string[];
    onOptionClick: (option: string) => void;
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onOptionClick, onClose }) => {
    return (
        <div className="context-menu" style={{ top: y, left: x }} onMouseLeave={onClose}>
            {options.map((option, index) => (
                <div key={index} className="context-menu-item" onClick={() => onOptionClick(option)}>
                    {option}
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;
