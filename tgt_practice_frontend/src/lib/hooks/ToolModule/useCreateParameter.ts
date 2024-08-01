import { useMutation } from "@apollo/client";
import { CREATE_PARAMETER } from "src/graphql/mutations/ToolModule/createParameter";

export const useCreateParameter = () => {
    const [createParameter, { data, loading, error }] = useMutation(CREATE_PARAMETER, {});

    return {
        createParameter,
        data,
        loading,
        error,
    };
}