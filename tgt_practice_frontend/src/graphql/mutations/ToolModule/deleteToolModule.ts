import { gql } from '@apollo/client';

export const DELETE_TOOL_MODULE = gql`
  mutation DeleteToolModule($input: DeleteToolModuleInput!) {
    deleteToolModule(input: $input) {
      success
    }
  }
`;