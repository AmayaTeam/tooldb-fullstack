import React from 'react';
import { useModal } from 'src/contexts/ModalContext';
import { LevelName, Option } from './contextMenuTypes';
import {NewParameter, Parameter, Sensor} from 'src/types/interfaces';

import GroupCreationModal from './modals/GroupCreationModal';
import GroupDeletionModal from './modals/GroupDeletionModal';
import TypeDeletionModal from './modals/TypeDeletionModal';
import TypeCreationModal from './modals/TypeCreationModal';
import ModuleDeletionModal from './modals/ModuleDeletionModal';
import ModuleCreationModal from './modals/ModuleCreationModal/ModuleCreationModal';

import { useCreateToolModuleGroup } from 'src/lib/hooks/ToolModuleGroup/useCreateToolModuleGroup';
import { useDeleteToolModuleGroup } from 'src/lib/hooks/ToolModuleGroup/useDeleteToolModuleGroup';
import { useCreateToolModuleType } from 'src/lib/hooks/ToolModuleType/useCreateToolModuleType';
import { useDeleteToolModuleType } from 'src/lib/hooks/ToolModuleType/useDeleteToolModuleType';
import { useCreateToolModule } from 'src/lib/hooks/ToolModule/useCreateToolModule';
import { useDeleteToolModule } from 'src/lib/hooks/ToolModule/useDeleteToolModule';
import { useToolModuleQuery } from 'src/lib/hooks/tool_module.ts';
import { useCreateParameter } from 'src/lib/hooks/ToolModule/useCreateParameter';
import { useCreateSensor } from 'src/lib/hooks/HousingSensors/useCreateSensor.ts';
import { useUnitSystem } from 'src/contexts/UnitSystemContext.tsx';


interface OptionsListProps {
    levelName: LevelName;
    objectId: string;
    onOptionClick: () => void;
}

const OptionsList: React.FC<OptionsListProps> = ({ levelName, objectId, onOptionClick }) => {

    const { setModal, setModalContent } = useModal();
    const { createToolModuleGroup } = useCreateToolModuleGroup();
    const { deleteToolModuleGroup } = useDeleteToolModuleGroup();

    const { createToolModuleType } = useCreateToolModuleType();
    const { deleteToolModuleType } = useDeleteToolModuleType();

    const { deleteToolModule } = useDeleteToolModule();
    const { createToolModule } = useCreateToolModule();

    const { createParameter } = useCreateParameter();

    const { createSensor } = useCreateSensor()

    const { selectedUnitId } = useUnitSystem();

    const { data } = useToolModuleQuery({
        id: objectId,
        unitSystem: selectedUnitId,
    });

    function getOptionsList() {
        const optionsNames: string[] = getOptionsNames();
        const optionsFunctions = getOptionsFunctions();

        const optionsList: Option[] = [];

        for (let i = 0; i < optionsNames.length; i++) {
            const option: Option = {optionName: optionsNames[i], command: optionsFunctions[i]};
            optionsList.push(option);
        }

        return optionsList;
    }


    function getOptionsNames() {
        const levelMap: Map<LevelName, string[]> = new Map();

        levelMap.set(LevelName.Group, ['Create New Group', 'Delete Group', 'Create New Type']);
        levelMap.set(LevelName.Type, ['Delete Type', 'Create New Module']);
        levelMap.set(LevelName.Module, ['Delete Module', 'Duplicate Module']);

        return levelMap.get(levelName)!;
    }

    function getOptionsFunctions() {
        const levelMap: Map<LevelName, any> = new Map();

        levelMap.set(LevelName.Group, getGroupFunctions(objectId));
        levelMap.set(LevelName.Type, getTypeFunctions(objectId));
        levelMap.set(LevelName.Module, getModuleFunctions(objectId));

        return levelMap.get(levelName)!;
    }

    function getGroupFunctions(groupId: string) {
        const groupManager = new GroupManager(groupId);
        const typeManager = new TypeManager(groupId);

        return [groupManager.showCreationModal, groupManager.showDeletionModal, typeManager.showCreationModal];
    }

    function getTypeFunctions(typeId: string) {
        const typeManager = new TypeManager(typeId);
        const moduleManager = new ModuleManager(typeId);

        return [typeManager.showDeletionModal, moduleManager.showCreationModal];
    }

    function getModuleFunctions(typeId: string) {
        const moduleManager = new ModuleManager(typeId);

        return [moduleManager.showDeletionModal, moduleManager.duplicateModule];
    }

    abstract class Manager {
        objectId: string;

        constructor(objectId: string) {
            this.objectId = objectId;
        }

        showCreationModal = () => {
            setModalContent(this.getCreationModal());
            setModal(true);
        }

        showDeletionModal = () => {
            setModalContent(this.getDeletionModal());
            setModal(true);
        }


        protected abstract getCreationModal(): any;
        protected abstract getDeletionModal(): any;

    }


    class GroupManager extends Manager {

        protected getCreationModal = () => {
            return (<GroupCreationModal onClose={onModalClose} onSubmit={this.saveNewGroup} />);
        }

        protected getDeletionModal = () => {
            return (<GroupDeletionModal onClose={onModalClose} onSubmit={this.deleteGroup} />)
        }

        private saveNewGroup = async (newGroupName: string) => {
            await createToolModuleGroup({
                variables: {
                    input: {
                        name: newGroupName
                    }
                }
            })

            onOptionClick();
        }

        private deleteGroup = async () => {
            const response = await deleteToolModuleGroup({
                variables: {
                    input: {
                        id: this.objectId
                    }
                }
            });

            if (response.data.deleteToolModuleGroup.success) {
                console.log("Deletion successful");
                onOptionClick();
            } else {
                throw new Error(`Failed to delete group with id ${this.objectId}`);
            }
        }
    }


    class TypeManager extends Manager {

        protected getCreationModal = () => {
            return (<TypeCreationModal onClose={onModalClose} onSubmit={this.saveNewType} />);
        }

        protected getDeletionModal = () => {
            return (<TypeDeletionModal onClose={onModalClose} onSubmit={this.deleteType} />)
        }

        private saveNewType = async (newTypeName: string) => {
            await createToolModuleType({
                variables: {
                    input: {
                        name: newTypeName,
                        rModuleGroup: this.objectId
                    }
                }
            });

            onOptionClick();
        }

        private deleteType = async () => {
            const response = await deleteToolModuleType({
                variables: {
                    input: {
                        id: this.objectId
                    }
                }
            });
            if (response.data.deleteToolModuleType.success) {
                console.log("Deletion successful");
                onOptionClick();
            } else {
                throw new Error(`Failed to delete type with id ${objectId}`);
            }
        }
    }

    class ModuleManager extends Manager {
        protected getCreationModal = () => {
            return (<ModuleCreationModal onClose={onModalClose} onSubmit={this.saveNewModule} />);
        }

        protected getDeletionModal = () => {
            return (<ModuleDeletionModal onClose={onModalClose} onSubmit={this.deleteModule} />)
        }

        private saveNewModule = async (newModuleData: any) => {
            const { data } = await createToolModule({
                variables: {
                    "input": {
                        "rModuleTypeId": this.objectId,
                        "sn": newModuleData.sn
                    }
                }
            });

            const newModuleId = data.createToolModule.toolModule.id;

            await this.createParameters(newModuleId, newModuleData.parameters);

            onOptionClick();
        }

        private createParameters = async (newModuleId: string, parameters: NewParameter[]) => {
            for (const param of parameters) {
                try {
                    const { data } = await createParameter({
                        variables: {
                            "input": {
                                "toolmoduleId": newModuleId,
                                "parameterType": param.parameterTypeId,
                                "parameterValue": param.parameterValue,
                                "unitId": param.unitId
                            }
                        }
                    });
                    console.log('Parameter created with ID:', data.createParameter.parameter.id);
                } catch (err) {
                    console.error('Error creating parameter:', err);
                }
            }
        }

        private createSensors = async (newModuleId: string, sensors: any[]) => {
            for (const sensor of sensors) {
                try {
                    const { data } = await createSensor({
                        variables: {
                            "input": {
                                "rToolmoduleId": newModuleId,
                                "rToolsensortypeId": sensor.rToolsensortypeId,
                                "recordPoint": sensor.recordPoint,
                                "unitId": sensor.unitId
                            }
                        }
                    });
                    console.log('Sensor created with ID:', data.createToolInstalledSensor.toolInstalledSensor.id);
                } catch (err) {
                    console.error('Error creating sensor:', err);
                }
            }
        }

        private deleteModule = async () => {
            const response = await deleteToolModule({
                variables: {
                    input: {
                        id: objectId
                    }
                }
            });
            if (response.data.deleteToolModule.success) {
                console.log("Deletion successful");
                onOptionClick();
            } else {
                throw new Error(`Failed to delete module with id ${objectId}`);
            }
        }

        public duplicateModule = async () => {
            try {
                const originalModule = data;
                const { data: duplicatedModuleData } = await createToolModule({
                    variables: {
                        "input": {
                            "rModuleTypeId": originalModule.rModuleType.id,
                            "dbtname": originalModule.dbtname,
                            "image": originalModule.image,
                            "sn": "Duplicated:" + originalModule.sn, // временное решение
                        },
                    },
                });

                const duplicatedModuleId = duplicatedModuleData.createToolModule.toolModule.id;

                const duplicatedParameters = originalModule.parameterSet.map((param: Parameter) => ({
                    parameterTypeId: param.parameterType.id,
                    parameterValue: param.parameterValue,
                    unitId: param.unit.id,
                }));

                const duplicatedSensors = originalModule.toolinstalledsensorSet.map((sensor: Sensor) => ({
                    rToolsensortypeId: sensor.rToolsensortype.id,
                    recordPoint: sensor.recordPoint,
                    unitId: sensor.unit.id,
                }));

                await this.createParameters(duplicatedModuleId, duplicatedParameters);

                await this.createSensors(duplicatedModuleId, duplicatedSensors);

                console.log('Module duplicated successfully');

                onOptionClick();
            } catch (error) {
                console.error('Error duplicating module:', error);
            }
        };
    }

    const onModalClose = () => {
        setModal(false);
        setModalContent(null);
    };

    return (
        <div>
            {getOptionsList().map((option, index) => (
                <div key={index} className="context-menu-item" onClick={option.command}>
                    {option.optionName}
                </div>
            ))}
        </div>);
};

export default OptionsList;