import { gql } from '@apollo/client';

export const UNIT_SYSTEMS_QUERY = gql`
  query unitSystemsQuery {
    unitSystems {
      id
      name {
        en
      }
    }
  }
`;
