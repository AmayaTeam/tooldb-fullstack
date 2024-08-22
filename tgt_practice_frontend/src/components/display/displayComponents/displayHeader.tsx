import React, { useState, useEffect } from "react";
import { useToolModuleGroup } from "src/lib/hooks/useToolModuleGroup.ts";
import { useToolModuleTypesById } from "src/lib/hooks/useToolModuleTypeByGroupId";
import { ToolModuleGroup, ToolModuleType } from "src/types/interfaces.ts";

interface DisplayHeaderProps {
  sn: string;
  groupId: string;
  moduleId: string;
  housing: string;
  role: string | undefined;
  handleSnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleModuleTypeIdChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGroupIdChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({
  sn,
  groupId,
  moduleId,
  housing,
  role,
  handleSnChange,
  handleModuleTypeIdChange,
  handleGroupIdChange,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState(groupId);
  const [selectedModuleId, setSelectedModuleId] = useState(moduleId);

  const { tool_module_group } = useToolModuleGroup();
  const { tool_module_types } = useToolModuleTypesById(selectedGroupId);

  useEffect(() => {
    if (tool_module_types.length > 0 && !tool_module_types.find((type: ToolModuleType) => type.id === selectedModuleId)) {
      // If the current selected module is not in the new list, default to the first module type
      const defaultModuleId = tool_module_types[0].id;
      setSelectedModuleId(defaultModuleId);
      handleModuleTypeIdChange({
        target: { value: defaultModuleId },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [tool_module_types, selectedModuleId]);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroupId = event.target.value;
    setSelectedGroupId(newGroupId);
    handleGroupIdChange(event);
  };

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModuleId = event.target.value;
    setSelectedModuleId(newModuleId);
    handleModuleTypeIdChange(event);
  };

  return (
    <div className="display-content-title">
      <div className="title">
        <div className="heading-of-param">
          <h4 className="heading-of-param">SN :</h4>
        </div>
        <input
          type="text"
          defaultValue={sn}
          onChange={handleSnChange}
          disabled={role === "User"}
        />
      </div>
      <div className="title">
        <div className="display-content-titles">
          <div className="title">
            <div className="heading-of-param">
              <h4 className="heading-of-param">Group: </h4>
            </div>
            <select
              value={selectedGroupId}
              onChange={handleGroupChange}
              disabled={role === "User"}
            >
              {tool_module_group.map((group: ToolModuleGroup) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="title">
            <div className="heading-of-param">
              <h4 className="heading-of-param">Module Type: </h4>
            </div>
            <select
              value={selectedModuleId}
              onChange={handleModuleChange}
              disabled={role === "User"}
            >
              {tool_module_types.map((moduleType: ToolModuleType) => (
                <option key={moduleType.id} value={moduleType.id}>
                  {moduleType.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="title">
        <div className="heading-of-param">
          <h4 className="heading-of-param">Housing: </h4>
        </div>
        <input type="text" defaultValue={housing} disabled={true} />
      </div>
    </div>
  );
};

export default DisplayHeader;
