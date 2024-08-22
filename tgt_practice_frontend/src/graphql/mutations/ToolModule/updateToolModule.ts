import { gql } from '@apollo/client';

export const UPDATE_TOOL_MODULE = gql`
  mutation UpdateToolModule($input: UpdateToolModuleInput!) {
    updateToolModule(input: $input) {
      toolModule {
        sn
        image
        }
    }
}
`;