import { useMutation } from '@apollo/client';
import { UPDATE_TOOL_MODULE } from 'src/graphql/mutations/ToolModule/updateToolModule';

export const useUpdateToolModule = () => {
    const [updateToolModule, { data, loading, error }] = useMutation(UPDATE_TOOL_MODULE, {});

    return {
        updateToolModule,
        data,
        loading,
        error,
    };
};