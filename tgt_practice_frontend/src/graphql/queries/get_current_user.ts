import { gql } from '@apollo/client';

const GET_CURRENT_USER = gql`
  query Me {
    me {
    id
      username
      groups {
        name
      }
    }
  }
`;

export default GET_CURRENT_USER;
