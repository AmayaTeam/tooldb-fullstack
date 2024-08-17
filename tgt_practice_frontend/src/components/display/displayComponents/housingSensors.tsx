import React, { useState } from "react";
import { Sensor } from "src/types/interfaces";

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
        <div className="params">
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
    role: string | undefined;
}

const DisplaySensorComponent: React.FC<DisplaySensorComponentProps> = ({
    sensor,
    recordPoint,
    onChange,
    isInvalid,
    role,
}) => (
    <>
        <td>
            <input
                type="text"
                defaultValue={sensor.rToolsensortype.name}
                disabled={role === "User"}
            />
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

export default HousingSensors;
