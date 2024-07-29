import { gql } from "@apollo/client";

export const CREATE_TOOL_MODULE_GROUP = gql`
    mutation CreateToolmoduleGroup($input: CreateToolModuleGroupInput!) {
        createToolModuleGroup(input: $input) {
            toolModuleGroup {
                name
            }
        }
    }
`;