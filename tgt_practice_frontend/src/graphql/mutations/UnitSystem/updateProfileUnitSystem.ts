import { gql } from '@apollo/client';

export const UPDATE_PROFILE_UNIT_SYSTEM = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      profile {
        unitsystem {
          id
          name {
            en
          }
        }
        language
      }
    }
  }
`;
