import { gql } from '@apollo/client';

export const DELETE_TOOL_MODULE_GROUP = gql`
  mutation DeleteToolModuleGroup($input: DeleteToolModuleGroupInput!) {
    deleteToolModuleGroup(input: $input) {
      success
    }
  }
`;