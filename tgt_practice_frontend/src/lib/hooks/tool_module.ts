import { useQuery } from '@apollo/client';
import ToolModule from "src/graphql/queries/tool_module";

interface UseToolModuleQueryProps {
    id: string | null;
    unitSystem: string | null;
}

const useToolModuleQuery = ({ id, unitSystem }: UseToolModuleQueryProps) => {
    console.log("Параметры из хука:", id, unitSystem);

    const { loading, error, data } = useQuery(ToolModule, { variables: { id, unitSystem }, fetchPolicy: 'no-cache' });

    return {
        loading,
        error,
        data: data?.toolModulesByIdWithUnitSystem || {},
    };
};

export default useToolModuleQuery;
