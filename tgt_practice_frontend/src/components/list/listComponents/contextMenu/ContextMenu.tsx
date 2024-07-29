import React from 'react';
import "../../List.css"
import { LevelName } from './contextMenuServices';
import OptionsList from './OptionsList';

interface ContextMenuProps {
    x: number;
    y: number;
    levelName: LevelName;
    objectId: string;
    onClose: () => void;
    onOptionClick: () => void;
}


const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, levelName, objectId, onClose, onOptionClick }) => {
    return (
        <div className="context-menu" style={{ top: y, left: x }} onMouseLeave={onClose}>
            <OptionsList levelName={levelName} objectId={objectId} onOptionClick={onOptionClick} />
        </div>
    );
};

export default ContextMenu;