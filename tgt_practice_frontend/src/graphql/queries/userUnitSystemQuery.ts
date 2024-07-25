import { gql } from '@apollo/client';

const USER_UNIT_SYSTEM = gql`
    query userUnitSystem($userId: String!) {
      profileById(userId: $userId) {
        unitsystem {
          id
          name {
            en
          }
        }
      }
    }
`;

export default USER_UNIT_SYSTEM;
