import { useMutation } from "@apollo/client";
// @ts-ignore
import { TOOLMODULE_UPDATE } from "src/graphql/mutations/ToolModuleUpdate/toolModuleUpdate.ts";

export const useToolModuleUpdate = () => {
    const [updateToolModule, { data, loading, error }] = useMutation(TOOLMODULE_UPDATE);

    return {
        updateToolModule,
        data,
        loading,
        error,
    };
};
