import { gql } from '@apollo/client';

export default gql`
    query ToolModuleTypesByGroupName($groupName: String!) {
        toolModuleTypesByGroupName(groupName: $groupName) {
            id
            name
        }
    }
`;