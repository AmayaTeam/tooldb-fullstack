import { useMutation } from "@apollo/client";
import { PARAMETER_UPDATE} from "../../../graphql/mutations/ToolModule/parameterUpdate.ts";

export const useParameterUpdate = () => {
    const [updateParameter, { data, loading, error }] = useMutation(PARAMETER_UPDATE);

    return {
        updateParameter,
        data,
        loading,
        error,
    };
};
