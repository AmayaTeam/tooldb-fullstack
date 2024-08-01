import { useQuery } from "@apollo/client";
import parameter_types from "src/graphql/queries/parameter_types";

interface UseParameterTypesWithUnitsProps {
    unitSystemId: string
}

const useParametersWithUnitsQuery = ({ unitSystemId }: UseParameterTypesWithUnitsProps) => {

    const { loading, error, data } = useQuery(parameter_types, { variables: { unitSystemId } });

    return {
        loading,
        error,
        data,
    };
};

export default useParametersWithUnitsQuery;