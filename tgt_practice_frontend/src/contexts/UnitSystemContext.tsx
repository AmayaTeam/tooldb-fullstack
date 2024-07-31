import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UnitSystemType {
    selectedUnitId: string;
    setSelectedUnitId: (unitId: string) => void;
}

const defaultContextValue: UnitSystemType = {
    selectedUnitId: '',
    setSelectedUnitId: () => { },
};

const UnitSystemContext = createContext<UnitSystemType>(defaultContextValue);

interface UnitSystemProps {
    children: ReactNode;
}

export const UnitSystemProvider: React.FC<UnitSystemProps> = ({ children }) => {
    const [selectedUnitId, setSelectedUnitId] = useState('');

    return (
        <UnitSystemContext.Provider value={{ selectedUnitId, setSelectedUnitId }}>
            {children}
        </UnitSystemContext.Provider>
    );
};

export const useUnitSystem = () => useContext(UnitSystemContext);