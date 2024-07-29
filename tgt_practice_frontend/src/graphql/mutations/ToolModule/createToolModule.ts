import { gql } from '@apollo/client';

export const CREATE_TOOL_MODULE = gql`
  mutation CreateToolModule($input: CreateToolModuleInput!) {
    createToolModule(input: $input) {
      toolModule {
        id,
        sn,
        dbtname
        }
    }
}
`;