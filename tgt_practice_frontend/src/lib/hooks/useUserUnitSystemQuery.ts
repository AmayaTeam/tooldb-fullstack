import { useQuery } from '@apollo/client';
import USER_UNIT_SYSTEM from '../../graphql/queries/userUnitSystemQuery.ts';

export const useUserUnitSystemQuery = (userId: string) => {
    const { loading, error, data } = useQuery(USER_UNIT_SYSTEM, {
        variables: { userId },
    });

    return {
        loading,
        error,
        data,
    };
};
