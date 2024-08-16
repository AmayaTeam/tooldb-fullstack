import { useQuery } from "@apollo/client";
import ToolModuleGroup from "src/graphql/queries/tool_module_groups";


export const useToolModuleGroup = () => {
    const { data, loading, error } = useQuery(ToolModuleGroup, {
        fetchPolicy: 'network-only', // Used for first execution
        nextFetchPolicy: 'cache-first', // Used for subsequent executions
    });

    return {
        tool_module_group: data?.toolModuleGroups || [],
        group_loading: loading,
        group_error: error,
    }
};