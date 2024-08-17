import { gql } from "@apollo/client";

export default gql`
    query ToolModuleTypesByGroupId($groupId: String!) {
        toolModuleTypesByGroupId(groupId: $groupId) {
            id
            name
        }
    }
`;