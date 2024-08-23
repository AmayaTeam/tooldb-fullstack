import { gql } from '@apollo/client';

export const UPLOAD_TOOL_MODULE = gql`
  mutation UploadToolModule($input: UploadToolModuleInput!) {
    uploadToolModules(input: $input) {
      success
    }
}
`;