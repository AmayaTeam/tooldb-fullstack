import React, { useState, useEffect } from 'react';
import { useUnitSystem } from 'src/contexts/UnitSystemContext';
import useParametersWithUnitsQuery from 'src/lib/hooks/parameter_types';
import {NewParameter, ParameterWithUnitSystem} from 'src/types/interfaces';
import './ModuleCreationModal.css';

interface ModuleCreationModalProps {
  onClose: () => void;
  onSubmit: (parameters: any) => void;
}

const ModuleCreationModal: React.FC<ModuleCreationModalProps> = ({ onClose, onSubmit }) => {
  const { selectedUnitId } = useUnitSystem();
  const { data } = useParametersWithUnitsQuery({ unitSystemId: selectedUnitId });

  const [parameters, setParameters] = useState<NewParameter[]>([]);
  const [moduleSN, setModuleSN] = useState<string>('');

  const hiddenParameters = ['Image h_y1', 'Image h_y2'];

  useEffect(() => {
    if (data?.parametersWithUnitSystem) {
      const filteredParameters = data.parametersWithUnitSystem
        .filter((param: ParameterWithUnitSystem) => !hiddenParameters.includes(param.parameterType.parameterName))
        .map((param: ParameterWithUnitSystem) => ({
          parameterTypeId: param.parameterType.id,
          parameterValue: 0,
          unitId: param.unit.id,
        }));
      setParameters(filteredParameters);
    }
  }, [data]);

  const handleInputChange = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].parameterValue = value;
    setParameters(newParameters);
  };

  const handleSubmit = () => {
    const filteredParameters = parameters.filter(param => param.parameterValue !== 0);
    const newModuleData = {
      'sn': moduleSN,
      parameters: filteredParameters
    };
    onSubmit(newModuleData);
    onClose();
  };

  return (
    <div className="modal-content">
      <h2>Enter a new module data:</h2>
      <div className="inputs">
        <label>
          <span>Serial number:</span>
          <input
            type="text"
            value={moduleSN}
            onChange={(e) => setModuleSN(e.target.value)}
          />
        </label>
        {parameters.map((param, index) => {
          const originalParam = data.parametersWithUnitSystem.find((p: ParameterWithUnitSystem) => p.parameterType.id === param.parameterTypeId);
          return originalParam ? (
            <label key={index}>
              <span>{originalParam.parameterType.parameterName} ({originalParam.unit.name.en}):</span>
              <input
                type="text"
                value={param.parameterValue || ''}
                onChange={(e) => handleInputChange(index, Number(e.target.value))}
              />
            </label>
          ) : null;
        })}
      </div>
      <div className="modal-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ModuleCreationModal;
