import { gql } from '@apollo/client';

export default gql`
  query Tree {
    toolModuleGroups {
      id
      name
      toolmoduletypeSet {
        id
        name
        toolmoduleSet {
          id
          sn
        }
      }
    }
  }
`;
