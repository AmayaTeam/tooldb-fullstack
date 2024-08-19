import React, { useState, useEffect } from "react";
import "./Display.css";
import { useToolModuleQuery } from "../../lib/hooks/tool_module.ts";
import { useParameterUpdate } from "../../lib/hooks/ToolModule/useParameterUpdate.ts";
import { useRecordPointUpdate } from "src/lib/hooks/HousingSensors/useRecordPointUpdate.ts";
import { useUpdateToolModule } from "src/lib/hooks/ToolModule/useUpdateToolModule";
import Cookies from 'js-cookie';
import HousingParams from "./displayComponents/housingParams.tsx";
import DisplayHeader from "./displayComponents/displayHeader.tsx";
import HousingSensors from "./displayComponents/housingSensors.tsx";
import ImageSection from "./displayComponents/imageSection.tsx";
import ControlButtons from "./displayComponents/controlButtons.tsx";
import { Parameter, Sensor } from "src/types/interfaces.ts";
import { useModal } from "src/contexts/ModalContext.tsx";
import MessageModal from "./displayComponents/messageModal.tsx";
import { useUnitSystem } from "src/contexts/UnitSystemContext.tsx";
import { useRecordPointUnitQuery} from "src/lib/hooks/HousingSensors/useRecordPointUnitQuery.ts";
import { useCreateSensor } from "src/lib/hooks/HousingSensors/useCreateSensor.ts";

interface DisplayProps {
    selectedItemId: string | null;
    onSave: () => void; // New prop for handling save action
}

const Display: React.FC<DisplayProps> = ({ selectedItemId, onSave }) => {
    const { selectedUnitId } = useUnitSystem();

    const { loading, error, data } = useToolModuleQuery({ id: selectedItemId, unitSystem: selectedUnitId });
    const { updateParameter } = useParameterUpdate();
    const { updateRecordPoint } = useRecordPointUpdate();
    const { updateToolModule } = useUpdateToolModule();
    const { createSensor } = useCreateSensor();
    const { recordPointUnit, loading: unitLoading, error: unitError } = useRecordPointUnitQuery(selectedUnitId);
    const [parameters, setParameters] = useState<Record<string, string>>({});
    const [sensorRecordPoints, setSensorRecordPoints] = useState<Record<string, string>>({});
    const [invalidParameters, setInvalidParameters] = useState<Record<string, boolean>>({});
    const [sn, setSn] = useState<string>('');
    const [selectedModuleTypeId, setSelectedModuleTypeId] = useState<string>('');
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const hiddenParameters = ['Image h_y1', 'Image h_y2'];

    const { setModal, setModalContent } = useModal();

    const onModalClose = () => {
        setModal(false);
    }

    const showMessageModal = (message: string) => {
        setModalContent(<MessageModal message={message} onClose={onModalClose} />);
        setModal(true);
    }

    useEffect(() => {
        if (data && data.parameterSet) {
            const initialParameters = data.parameterSet.reduce((acc: Record<string, string>, param: Parameter) => {
                if (!hiddenParameters.includes(param.parameterType.parameterName)) {
                    acc[param.id] = param.parameterValue.toFixed(2);
                }
                return acc;
            }, {});
            setParameters(initialParameters);
        }

        if (data && data.toolinstalledsensorSet) {
            const initialSensors = data.toolinstalledsensorSet.reduce((acc: Record<string, string>, sensor: Sensor) => {
                acc[sensor.id] = sensor.recordPoint.toFixed(2);
                return acc;
            }, {});
            setSensorRecordPoints(initialSensors);
            setSensors(data.toolinstalledsensorSet);
        }

        if (data) {
            setSn(data.sn);
            console.log(data);
            setSelectedModuleTypeId(data.rModuleType?.id || '');
            setSelectedGroupId(data.rModuleType?.rModulesGroup?.id || '');
        }
    }, [data]);

    const handleParameterChange = (paramId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const regex = /^\d*\.?\d*$/;

        setParameters((prevParameters) => ({
            ...prevParameters,
            [paramId]: value,
        }));

        if (regex.test(value)) {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [paramId]: false,
            }));
        } else {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [paramId]: true,
            }));
        }
    };

    const handleSensorRecordPointChange = (sensor: Sensor) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const regex = /^\d*\.?\d*$/;

        setSensorRecordPoints((prevRecordPoints) => ({
            ...prevRecordPoints,
            [sensor.id]: value,
        }));

        if (regex.test(value)) {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [sensor.id]: false,
            }));
        } else {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [sensor.id]: true,
            }));
        }
    };

    const handleSensorTypeChange = (sensor: Sensor) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        setSensors((prevSensors) =>
            prevSensors.map((s) =>
                s.id === sensor.id ? { ...s, rToolsensortype: { id: value, name: event.target.selectedOptions[0].text } } : s
            )
        );
    };

    const handleToolModuleSnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSn(value);
    };

    const handleModuleTypeIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setSelectedModuleTypeId(value);
    };

    const handleGroupIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const groupId = event.target.value;
        setSelectedGroupId(groupId);
    };

    const handleSave = async () => {
        const hasInvalidInputs = Object.values(invalidParameters).some((isInvalid) => isInvalid);

        if (hasInvalidInputs) {
            showMessageModal("The entered values have the wrong data type, the data will not be saved.");
            return;
        }

        if (selectedItemId && data && data.parameterSet) {
            const updatedParameters = Object.entries(parameters).reduce((acc, [paramId, value]) => {
                const originalParam = data.parameterSet.find((param: Parameter) => param.id === paramId);
                if (originalParam && originalParam.parameterValue.toFixed(2) !== value) {
                    acc.push({ id: paramId, parameterValue: parseFloat(value), unitId: originalParam.unit.id });
                }
                return acc;
            }, [] as { id: string; parameterValue: number; unitId: string }[]);

            const updatedSensors = Object.entries(sensorRecordPoints).reduce((acc, [sensorId, value]) => {
                const originalSensor = data.toolinstalledsensorSet.find((sensor: Sensor) => sensor.id === sensorId);
                if (originalSensor && originalSensor.recordPoint.toFixed(2) !== value) {
                    acc.push({ id: sensorId, recordPoint: parseFloat(value), unitId: originalSensor.unit.id });
                }
                return acc;
            }, [] as { id: string; recordPoint: number, unitId: string }[]);

            const updatedSn = data.sn !== sn;
            const updatedModuleType = data.rModuleType.id !== selectedModuleTypeId || data.rModuleType.rModulesGroup.id !== selectedGroupId;
            const newSensors = sensors.filter(sensor => sensor.id.startsWith('new-'));

            if (updatedParameters.length > 0 || updatedSensors.length > 0 || updatedSn || updatedModuleType || newSensors) {
                try {
                    for (const param of updatedParameters) {
                        await updateParameter({
                            variables: {
                                input: {
                                    id: param.id,
                                    parameterValue: param.parameterValue,
                                    unitId: param.unitId
                                }
                            }
                        });
                    }
                    for (const sensor of updatedSensors) {
                        await updateRecordPoint({
                            variables: {
                                input: {
                                    id: sensor.id,
                                    recordPoint: sensor.recordPoint,
                                    unitId: sensor.unitId
                                }
                            }
                        });
                    }

                    await updateToolModule({
                        variables: {
                            input: {
                                id: selectedItemId,
                                sn: data.sn,
                                rModuleTypeId: data.rModuleType.id
                            }
                        }
                    });

                    if (updatedSn) {
                        await updateToolModule({
                            variables: {
                                input: {
                                    id: selectedItemId,
                                    sn: sn,
                                }
                            }
                        });
                    }
                    if (updatedModuleType) {
                        await updateToolModule({
                            variables: {
                                input: {
                                    id: selectedItemId,
                                    rModuleTypeId: selectedModuleTypeId
                                }
                            }
                        });
                    }

                    for (const sensor of newSensors) {
                        await createSensor({
                            variables: {
                                input: {
                                    rToolmoduleId: selectedItemId,
                                    rToolsensortypeId: sensor.rToolsensortype.id,
                                    recordPoint: parseFloat(sensorRecordPoints[sensor.id]),
                                    unitId: recordPointUnit.id,
                                },
                            },
                        });
                    }
                    onSave();
                    showMessageModal("The update was successful!");
                } catch (error) {
                    showMessageModal("An error occurred while saving the data.")
                }
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (unitLoading || !recordPointUnit) return <div>Loading...</div>;
    if (unitError) return <div>Error: {unitError.message}</div>;


    const img = data.image;

    const role = Cookies.get('role');

    const handleUndoChanges = () => {
        if (data && data.parameterSet) {
            const initialParameters = data.parameterSet.reduce((acc: Record<string, string>, param: Parameter) => {
                if (!hiddenParameters.includes(param.parameterType.parameterName)) {
                    acc[param.id] = param.parameterValue.toFixed(2);
                }
                return acc;
            }, {});
            setParameters(initialParameters);
        }

        if (data && data.toolinstalledsensorSet) {
            const initialSensors = data.toolinstalledsensorSet.reduce((acc: Record<string, string>, sensor: Sensor) => {
                acc[sensor.id] = sensor.recordPoint.toFixed(2);
                return acc;
            }, {});
            setSensorRecordPoints(initialSensors);
            setSensors(data.toolinstalledsensorSet);
        }

        setInvalidParameters({});
        setSn(data.sn);
    };

    return (
        <div className="display-container">
            <div className="display">
                <div className="display-content">
                    <DisplayHeader
                        sn={sn}
                        groupId={data.rModuleType.rModulesGroup.id}
                        moduleId={data.rModuleType.id}
                        housing={`${data.rModuleType.rModulesGroup.name}:${data.sn}`}
                        role={role}
                        handleSnChange={handleToolModuleSnChange}
                        handleModuleTypeIdChange={handleModuleTypeIdChange}
                        handleGroupIdChange={handleGroupIdChange}
                    />

                    <div className="display-content-info">
                        <div className="display-content-info-params">
                            <HousingParams
                                parameters={parameters}
                                parameterSet={data.parameterSet}
                                hiddenParameters={hiddenParameters}
                                invalidParameters={invalidParameters}
                                handleParameterChange={handleParameterChange}
                                role={role}
                            />

                            <HousingSensors
                                sensors={sensors}
                                sensorRecordPoints={sensorRecordPoints}
                                handleSensorRecordPointChange={handleSensorRecordPointChange}
                                handleSensorTypeChange={handleSensorTypeChange}
                                invalidParameters={invalidParameters}
                                role={role}
                                setSensors={setSensors}
                                unit={recordPointUnit}
                            />
                        </div>

                        <ImageSection
                            toolModuleId={selectedItemId!}
                            img={img}
                            sn={sn}
                            role={role}
                        />
                    </div>
                    <ControlButtons
                        handleSave={handleSave}
                        handleUndoChanges={handleUndoChanges}
                        role={role}
                    />
                </div>
            </div>

        </div >
    );
};

export default Display;
