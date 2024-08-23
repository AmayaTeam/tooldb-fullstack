import { useQuery } from "@apollo/client";
import ToolSensorTypes from "src/graphql/queries/tool_sensor_types";

export const useToolSensorTypesQuery = () => {
    const { data, loading, error } = useQuery(ToolSensorTypes, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    return {
        toolSensorTypes: data?.toolSensorTypes || [],
        loading,
        error,
    }
};
