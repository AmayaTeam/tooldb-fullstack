import { useMutation } from "@apollo/client";
import { CREATE_TOOL_MODULE_TYPE } from "src/graphql/mutations/ToolModuleType/createToolModuleType";

export const useCreateToolModuleType = () => {
    const [createToolModuleType, { data, loading, error }] = useMutation(CREATE_TOOL_MODULE_TYPE);

    return {
        createToolModuleType,
        data,
        loading,
        error
    }
};