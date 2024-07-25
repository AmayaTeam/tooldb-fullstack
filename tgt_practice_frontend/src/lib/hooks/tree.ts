import { useQuery } from '@apollo/client';
import TREE_QUERY from "src/graphql/queries/tree";

const useTreeQuery = () => {
    const { loading, error, data } = useQuery(TREE_QUERY);

    return {
        loading,
        error,
        data
    };
}

export default useTreeQuery;
