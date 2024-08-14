import { gql } from '@apollo/client';

export const ANALYSE_CSV_FILE = gql`
    query analyse_csv_file($file: String!) {
        analyseCsvFile(file: $file) {
            newModuleList {
                id
                odooId
                sn
                dbsn
                rModuleType {
                  name
                  rModulesGroup {
                    name
                  }
                }
            }
            modifiedModuleList {
                id
                odooId
                sn
                dbsn
                rModuleType {
                  name
                  rModulesGroup {
                    name
                  }
                }
            }
            errorsList {
                id
                sn
                dbsn
                rModuleType {
                  name
                  rModulesGroup {
                    name
                  }
                }
            }
            newParameters {
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
              toolmodule {
                id
              }
            }
            modifiedParameters {
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
                toolmodule {
                  id
                }
            }
            newGroupList {
                id
                name
            }
            newModuleTypeList {
                id
                name
            }
        }
    }
`;
