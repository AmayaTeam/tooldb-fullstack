import React, { useState } from "react";
import { Sensor } from "src/types/interfaces";
import { useToolSensorTypesQuery } from "src/lib/hooks/HousingSensors/useToolSensorTypesQuery.ts";

interface HousingSensorsProps {
    sensors: Sensor[];
    sensorRecordPoints: Record<string, string>;
    handleSensorRecordPointChange: (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    invalidParameters: Record<string, boolean>;
    role: string | undefined;
}

const HousingSensors: React.FC<HousingSensorsProps> = ({
    sensors: initialSensors,
    sensorRecordPoints,
    handleSensorRecordPointChange,
    invalidParameters,
    role,
}) => {
    const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
    const { toolSensorTypes } = useToolSensorTypesQuery();

    const handleAddRow = () => {
        const newSensor: Sensor = {
            id: `new-${Date.now()}`,
            rToolsensortype: { id: "", name: "" },
            unit: { id: "", name: { en: "" } },
            recordPoint: 0,
        };
        setSensors([...sensors, newSensor]);
    };

    const handleRemoveRow = (id: string) => {
        setSensors(sensors.filter(sensor => sensor.id !== id));
    };

    return (
        <div className="params-Housing_params">
            <h4>Housing Sensors</h4>
            <div className="table-container">
                <table className="Housing_params-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                                Record Point{initialSensors.length > 0 && initialSensors[0].unit.name.en ? `, ${initialSensors[0].unit.name.en}` : ""}
                            </th>
                            <th className="button-column">
                                <button
                                    className="add-row-button"
                                    onClick={handleAddRow}
                                    aria-label="Add Row"
                                >
                                    +
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sensors.map((sensor: Sensor) => (
                            <tr key={sensor.id}>
                                <DisplaySensorComponent
                                    sensor={sensor}
                                    recordPoint={sensorRecordPoints[sensor.id] || ""}
                                    onChange={handleSensorRecordPointChange}
                                    isInvalid={invalidParameters[sensor.id]}
                                    sensors={initialSensors}
                                    toolSensorTypes={toolSensorTypes}
                                    role={role}
                                />
                                <td className="button-column">
                                    <button
                                        className="remove-row-button"
                                        onClick={() => handleRemoveRow(sensor.id)}
                                        aria-label="Remove Row"
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface DisplaySensorComponentProps {
    sensor: Sensor;
    recordPoint: string;
    onChange: (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    isInvalid: boolean;
    sensors: Sensor[];
    toolSensorTypes: { id: string; name: string }[];
    role: string | undefined;
}

const DisplaySensorComponent: React.FC<DisplaySensorComponentProps> = ({
    sensor,
    recordPoint,
    onChange,
    isInvalid,
    sensors,
    toolSensorTypes,
    role,
}) => {
    const sensorOptions = toolSensorTypes.filter(
        (type) => type.id !== sensor.rToolsensortype.id
    );

    // обеспечиваем уникальность ключей (устранение warning о дублирующихся ключах)
    const options = [
        ...sensorOptions,
        {
            id: `custom-${sensor.rToolsensortype.id}`,
            name: sensor.rToolsensortype.name,
        },
    ];

    return (
        <>
            <td className="title">
                <select
                    defaultValue={`custom-${sensor.rToolsensortype.id}`}
                    disabled={role === "User"}
                    className="sensor-select"
                >
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <input
                    type="text"
                    value={recordPoint}
                    onChange={onChange(sensor.id)}
                    className={`sensors_parametrs ${isInvalid ? "invalid" : ""}`}
                    disabled={role === "User"}
                />
            </td>
        </>
    );
};


export default HousingSensors;
