import React, { useState, useEffect } from "react";
import "./Display.css";
import useToolModuleQuery from "../../lib/hooks/tool_module.ts";
import { useParameterUpdate } from "../../lib/hooks/ToolModule/useParameterUpdate.ts";
import { useRecordPointUpdate } from "src/lib/hooks/HousingSensors/useRecordPointUpdate.ts";
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

interface DisplayProps {
    selectedItemId: string | null;
}

const Display: React.FC<DisplayProps> = ({ selectedItemId }) => {
    const { selectedUnitId } = useUnitSystem();

    const { loading, error, data } = useToolModuleQuery({ id: selectedItemId, unitSystem: selectedUnitId });

    const { updateParameter } = useParameterUpdate();
    const { updateRecordPoint } = useRecordPointUpdate();
    const [parameters, setParameters] = useState<Record<string, string>>({});
    const [sensorRecordPoints, setSensorRecordPoints] = useState<Record<string, string>>({});
    const [invalidParameters, setInvalidParameters] = useState<Record<string, boolean>>({});
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
                acc[sensor.id] = sensor.recordPoint;
                return acc;
            }, {});
            setSensorRecordPoints(initialSensors);
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

    const handleSensorRecordPointChange = (sensorId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const regex = /^\d*\.?\d*$/;

        setSensorRecordPoints((prevRecordPoints) => ({
            ...prevRecordPoints,
            [sensorId]: value,
        }));

        if (regex.test(value)) {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [sensorId]: false,
            }));
        } else {
            setInvalidParameters((prevInvalid) => ({
                ...prevInvalid,
                [sensorId]: true,
            }));
        }
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
                if (originalSensor && originalSensor.recordPoint !== value) {
                    acc.push({ id: sensorId, recordPoint: value, unitId: originalSensor.unit.id });
                }
                return acc;
            }, [] as { id: string; recordPoint: string, unitId: string }[]);

            if (updatedParameters.length > 0 || updatedSensors.length > 0) {
                console.log("Обновление параметров:", updatedParameters);
                console.log("Обновление сенсоров:", updatedSensors);
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
                                    recordPoint: parseFloat(sensor.recordPoint),
                                    unitId: sensor.unitId
                                }
                            }
                        });
                    }

                    showMessageModal("The update was successful!")
                } catch (error) {
                    showMessageModal("An error occurred while saving the data.")
                }
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

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
                acc[sensor.id] = sensor.recordPoint;
                return acc;
            }, {});
            setSensorRecordPoints(initialSensors);
        }

        setInvalidParameters({});
    };

    return (
        <div className="display-container">
            <div className="display">
                <div className="display-content">
                    <DisplayHeader
                        sn={data.sn}
                        groupName={data.rModuleType.rModulesGroup.name}
                        moduleName={data.rModuleType.name}
                        housing={`${data.rModuleType.rModulesGroup.name}:${data.sn}`}
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
                                sensors={data.toolinstalledsensorSet}
                                sensorRecordPoints={sensorRecordPoints}
                                handleSensorRecordPointChange={handleSensorRecordPointChange}
                                invalidParameters={invalidParameters}
                                role={role}
                            />
                        </div>

                        <ImageSection
                            toolModuleId={selectedItemId!}
                            img={img}
                            sn={data.sn}
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