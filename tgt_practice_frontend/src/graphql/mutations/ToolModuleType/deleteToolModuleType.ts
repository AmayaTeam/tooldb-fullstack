import { gql } from '@apollo/client';

export const DELETE_TOOL_MODULE_TYPE = gql`
  mutation DeleteToolModuleType($input: DeleteToolModuleTypeInput!) {
    deleteToolModuleType(input: $input) {
      success
    }
  }
`;