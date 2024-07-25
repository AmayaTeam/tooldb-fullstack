import { useQuery } from '@apollo/client';
import { UNIT_SYSTEMS_QUERY } from '../../graphql/queries/unitSystemsQuery';

export const useUnitSystemsQuery = () => {
    const { loading, error, data } = useQuery(UNIT_SYSTEMS_QUERY);

    return {
        loading,
        error,
        data,
    };
};
