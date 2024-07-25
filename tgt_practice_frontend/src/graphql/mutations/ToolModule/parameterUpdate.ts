import { gql } from '@apollo/client';

export const PARAMETER_UPDATE = gql`
    mutation updateParameter($input: UpdateParameterInput!) {
        updateParameter(input: $input) {
            parameter {
                id
                parameterType {
                    parameterName
                }
            }
        }
    }
`;
