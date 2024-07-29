import { useMutation } from '@apollo/client';
import { DELETE_TOOL_MODULE } from "src/graphql/mutations/ToolModule/deleteToolModule.ts";

export const useDeleteToolModule = () => {
    const [deleteToolModule, { data, loading, error }] = useMutation(DELETE_TOOL_MODULE, {});

    return {
        deleteToolModule,
        data,
        loading,
        error,
    };
};