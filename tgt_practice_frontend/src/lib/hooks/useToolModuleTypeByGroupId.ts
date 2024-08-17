import { useQuery } from "@apollo/client";
import Tool_module_types_by_group_id from "src/graphql/queries/tool_module_types_by_group_id.ts";


export const useToolModuleTypesById = (groupId: string) => {
    const { data, loading, error } = useQuery(Tool_module_types_by_group_id, {
        variables: { groupId },
        fetchPolicy: 'network-only', // Used for first execution
        nextFetchPolicy: 'cache-first', // Used for subsequent executions
    });

    return {
        tool_module_types: data?.toolModuleTypesByGroupId || [],
        type_loading: loading,
        type_error: error,
    }
};