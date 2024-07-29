import { gql } from '@apollo/client';

export const RECORD_POINT_UPDATE = gql`
    mutation updateToolInstalledSensor($input: UpdateToolInstalledSensorInput!) {
      updateToolInstalledSensor(input: $input) {
        toolInstalledSensor {
          id
          recordPoint
          unit {
            id
          }
        }
      }
    }
`;
