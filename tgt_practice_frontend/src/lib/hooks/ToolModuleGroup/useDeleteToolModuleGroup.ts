import { useMutation } from '@apollo/client';
import { DELETE_TOOL_MODULE_GROUP} from "src/graphql/mutations/ToolModuleGroup/deleteToolModuleGroup.ts";

export const useDeleteToolModuleGroup = () => {
    const [deleteToolModuleGroup, { data, loading, error }] = useMutation(DELETE_TOOL_MODULE_GROUP, {});

    return {
        deleteToolModuleGroup,
        data,
        loading,
        error,
    };
};