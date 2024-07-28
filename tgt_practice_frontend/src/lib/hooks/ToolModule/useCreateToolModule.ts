import { useMutation } from '@apollo/client';
import { CREATE_TOOL_MODULE } from 'src/graphql/mutations/ToolModule/createToolModule';

export const useCreateToolModule = () => {
    const [createToolModule, { data, loading, error }] = useMutation(CREATE_TOOL_MODULE, {});

    return {
        createToolModule,
        data,
        loading,
        error,
    };
};