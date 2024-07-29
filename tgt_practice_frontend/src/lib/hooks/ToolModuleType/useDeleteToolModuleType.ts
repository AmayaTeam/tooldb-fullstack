import { useMutation } from '@apollo/client';
import { DELETE_TOOL_MODULE_TYPE } from "src/graphql/mutations/ToolModuleType/deleteToolModuleType.ts";

export const useDeleteToolModuleType = () => {
    const [deleteToolModuleType, { data, loading, error }] = useMutation(DELETE_TOOL_MODULE_TYPE, {});

    return {
        deleteToolModuleType,
        data,
        loading,
        error,
    };
};