// useTreeQuery.ts
import { useQuery } from '@apollo/client';
import TREE_QUERY from "src/graphql/queries/tree";

const useTreeQuery = (refetchKey: number) => {
    const { loading, error, data } = useQuery(TREE_QUERY, {
        fetchPolicy: 'no-cache',
        variables: { refetchKey }
    });

    return {
        loading,
        error,
        data
    };
}

export default useTreeQuery;
