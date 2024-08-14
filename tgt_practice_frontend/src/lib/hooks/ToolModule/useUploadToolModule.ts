import { useMutation } from '@apollo/client';
import { UPLOAD_TOOL_MODULE } from 'src/graphql/mutations/ToolModule/uploadToolModules';

export const useUploadToolModule = () => {
    const [uploadToolModule, { data, loading, error }] = useMutation(UPLOAD_TOOL_MODULE, {});

    return {
        uploadToolModule,
        data,
        loading,
        error,
    };
};