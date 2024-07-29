import { useMutation } from "@apollo/client";
import { RECORD_POINT_UPDATE } from "src/graphql/mutations/HousingSensors/recordPointUpdate.ts";

export const useRecordPointUpdate = () => {
    const [updateRecordPoint, { data, loading, error }] = useMutation(RECORD_POINT_UPDATE);

    return {
        updateRecordPoint,
        data,
        loading,
        error,
    };
};
