import React, { useState } from 'react';
import { ToolModuleGroup } from 'src/types/interfaces';
import { LevelName } from './contextMenu/contextMenuServices';
import ContextMenu from './contextMenu/ContextMenu';

interface LevelListProps {
    sortedData: ToolModuleGroup[];
    updateListData: () => void;
    onItemClick: (id: string) => void;
}

const LevelList: React.FC<LevelListProps> = ({ sortedData, updateListData, onItemClick }) => {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        levelName: LevelName;
        objectId: string;
    } | null>(null);

    const handleToggle = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleClick = (id: string) => {
        setSelectedItemId(id);
        onItemClick(id);
    };

    const showContextMenu = (event: React.MouseEvent, levelName: LevelName, id: string) => {
        event.preventDefault();

        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            levelName: levelName,
            objectId: id
        });
    };

    return (
        <div>
            {sortedData.map((dataObj) => (
                <div key={dataObj.id} className="level1">
                    <p onClick={() => handleToggle(dataObj.id)} onContextMenu={(event) => showContextMenu(event, LevelName.Group, dataObj.id)}>
                        {dataObj.name}
                    </p>
                    {expandedItems[dataObj.id] && (
                        <div className="level2">
                            {dataObj.toolmoduletypeSet.map((toolModuleType) => (
                                <div key={toolModuleType.id}>
                                    <p onClick={() => handleToggle(toolModuleType.id)} onContextMenu={(event) => showContextMenu(event, LevelName.Type, toolModuleType.id)}>
                                        {toolModuleType.name}
                                    </p>
                                    {expandedItems[toolModuleType.id] && (
                                        <div className="level3">
                                            {toolModuleType.toolmoduleSet.map((toolModule) => (
                                                <div key={toolModule.id}>
                                                    <p
                                                        onClick={() => handleClick(toolModule.id)}
                                                        onContextMenu={(event) => showContextMenu(event, LevelName.Module, toolModule.id)}
                                                        className={selectedItemId === toolModule.id ? 'selected' : ''}
                                                    >
                                                        {toolModule.sn}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    levelName={contextMenu.levelName}
                    objectId={contextMenu.objectId}
                    onClose={() => setContextMenu(null)}
                    onOptionClick={updateListData}
                />
            )}
        </div>
    );
};

export default LevelList;