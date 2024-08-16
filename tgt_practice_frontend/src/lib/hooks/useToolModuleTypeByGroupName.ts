import { useQuery } from "@apollo/client";
import Tool_module_types_by_group_name from "src/graphql/queries/tool_module_types_by_group_name.ts";


export const useToolModuleTypesByGroupName = (groupName:  string ) => {
    const { data, loading, error } = useQuery(Tool_module_types_by_group_name, {
        variables: { groupName },
        fetchPolicy: 'network-only', // Used for first execution
        nextFetchPolicy: 'cache-first', // Used for subsequent executions
    });

    return {
        tool_module_types: data?.toolModuleTypesByGroupName || [],
        type_loading: loading,
        type_error: error,
    }
};