import React from 'react';
import { useModal } from 'src/contexts/ModalContext';
import { LevelName, Option } from './contextMenuServices';

import GroupCreationModal from './modals/GroupCreationModal';
import GroupDeletionModal from './modals/GroupDeletionModal';
import TypeDeletionModal from './modals/TypeDeletionModal';
import TypeCreationModal from './modals/TypeCreationModal';
import ModuleDeletionModal from './modals/ModuleDeletionModal';
import ModuleCreationModal from './modals/ModuleCreationModal';

import { useCreateToolModuleGroup } from 'src/lib/hooks/ToolModuleGroup/useCreateToolModuleGroup';
import { useDeleteToolModuleGroup } from 'src/lib/hooks/ToolModuleGroup/useDeleteToolModuleGroup';
import { useCreateToolModuleType } from 'src/lib/hooks/ToolModuleType/useCreateToolModuleType';
import { useDeleteToolModuleType } from 'src/lib/hooks/ToolModuleType/useDeleteToolModuleType';
import { useCreateToolModule } from 'src/lib/hooks/ToolModule/useCreateToolModule';
import { useDeleteToolModule } from 'src/lib/hooks/ToolModule/useDeleteToolModule';

interface OptionsListProps {
    levelName: LevelName;
    objectId: string;
}

const OptionsList: React.FC<OptionsListProps> = ({ levelName, objectId }) => {

    const { setModal, setModalContent } = useModal();
    const { createToolModuleGroup } = useCreateToolModuleGroup();
    const { deleteToolModuleGroup } = useDeleteToolModuleGroup();

    const { createToolModuleType } = useCreateToolModuleType();
    const { deleteToolModuleType } = useDeleteToolModuleType();

    const { deleteToolModule } = useDeleteToolModule();
    const { createToolModule } = useCreateToolModule();

    function getOptionsList() {
        const optionsNames: string[] = getOptionsNames();
        const optionsFunctions = getOptionsFunctions();

        let optionsList: Option[] = [];

        for (var i = 0; i < optionsNames.length; i++) {
            var option: Option = { optionName: optionsNames[i], command: optionsFunctions[i] };
            optionsList.push(option);
        }

        return optionsList;
    }


    function getOptionsNames() {
        const levelMap: Map<LevelName, string[]> = new Map();

        levelMap.set(LevelName.Group, ['Create New Group', 'Delete Group', 'Create New Type']);
        levelMap.set(LevelName.Type, ['Delete Type', 'Create New Module']);
        levelMap.set(LevelName.Module, ['Delete Module']);

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

        return [moduleManager.showDeletionModal];
    }

    abstract class Manager {
        objectId: string;

        constructor(objectId: string) {
            this.objectId = objectId;
        }

        showCreationModal = () => {
            setModalContent(this.getCreationModal());

            console.log('get creation modal');

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
            const { data } = await createToolModuleGroup({
                variables: {
                    input: {
                        name: newGroupName
                    }
                }
            })

            const newGroup = data.createToolModuleGroup.toolModuleGroup;
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
            const { data } = await createToolModuleType({
                variables: {
                    input: {
                        name: newTypeName,
                        rModuleGroup: objectId
                    }
                }
            });

            const newToolModuleType = data.createToolModuleType.toolModuleType;
        }

        private deleteType = async () => {
            const response = await deleteToolModuleType({
                variables: {
                    input: {
                        id: objectId
                    }
                }
            });
            if (response.data.deleteToolModuleType.success) {
                console.log("Deletion successful");
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

        private saveNewModule = async (newModuleName: string, newModuleSerialNumber: string) => {
            console.log(objectId);
            const { data } = await createToolModule({
                variables: {
                    "input": {
                        "rModuleTypeId": objectId,
                        "sn": newModuleSerialNumber,
                        "dbtname": newModuleName
                    }
                }
            })

            const newModuleData = data.createToolModule.toolModule;
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
            } else {
                throw new Error(`Failed to delete module with id ${objectId}`);
            }
        }
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