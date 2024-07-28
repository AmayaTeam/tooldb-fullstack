import { useMutation } from "@apollo/client";
import { CREATE_TOOL_MODULE_GROUP } from "src/graphql/mutations/ToolModuleGroup/createToolModuleGroup";

export const useCreateToolModuleGroup = () => {
    const [createToolModuleGroup, { data, loading, error }] = useMutation(CREATE_TOOL_MODULE_GROUP);

    return {
        createToolModuleGroup,
        data,
        loading,
        error
    }
};