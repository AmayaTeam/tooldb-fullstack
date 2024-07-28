import { gql } from "@apollo/client";

export const CREATE_TOOL_MODULE_TYPE = gql`
    mutation CreateToolModuleType($input:CreateToolModuleTypeInput!) {
        createToolModuleType(input: $input) {
            toolModuleType {
                name,
                id
            }
        }
    }
`;