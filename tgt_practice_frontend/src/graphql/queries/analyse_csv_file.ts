import { gql } from '@apollo/client';

export const ANALYSE_CSV_FILE = gql`
    query analyse_csv_file($file: String!) {
        analyseCsvFile(file: $file) {
            newModuleList {
                id
                sn
                dbsn
                rModuleType {
                  name
                  rModulesGroup {
                    name
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
            modifiedModuleList {
                id
                sn
                dbsn
                rModuleType {
                  name
                  rModulesGroup {
                    name
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
    }
`;
