import { gql } from '@apollo/client';

export default gql`
    query toolModulesByIdWithUnitSystem($id: String!, $unitSystem: String!) {
        toolModulesByIdWithUnitSystem(id: $id, unitSystem: $unitSystem) {
            id
            sn
            dbsn
            dbtname
            image
            rModuleType {
              name
              rModulesGroup {
                name
              }
            }
            toolinstalledsensorSet {
              rToolsensortype {
                id
                name
              }
              id
              recordPoint
              unit {
                name {
                  en
                }
                id
              }
            }
            parameterSet {
              id
              parameterType {
                parameterName
              }
              parameterValue
              unit {
                name {
                  en
                }
                id
              }
            }
        }
    }
`;
