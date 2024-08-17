import { useMutation } from "@apollo/client";
import { CREATE_SENSOR } from "src/graphql/mutations/HousingSensors/createSensor.ts";

export const useCreateSensor = () => {
    const [createSensor, { data, loading, error }] = useMutation(CREATE_SENSOR, {});

    return {
        createSensor,
        data,
        loading,
        error,
    };
}