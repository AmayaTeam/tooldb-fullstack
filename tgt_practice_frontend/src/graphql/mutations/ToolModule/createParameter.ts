import { gql } from "@apollo/client";

export const CREATE_PARAMETER = gql`
    mutation createParameter($input: CreateParameterInput!) {
        createParameter(input: $input) {
            parameter {
                id
            }
        }
    }
`