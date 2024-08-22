import { useQuery } from "@apollo/client";
import record_point_unit_by_unit_system_id from "src/graphql/queries/record_point_unit_by_unit_system_id.ts";

export const useRecordPointUnitQuery = (unitSystemId: string) => {
    const { data, loading, error } = useQuery(record_point_unit_by_unit_system_id, {
        variables: { unitSystemId },
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    return {
        recordPointUnit: data?.recordPointUnitByUnitSystem || [],
        loading,
        error,
    }
};
