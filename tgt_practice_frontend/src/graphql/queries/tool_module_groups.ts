import { gql } from "@apollo/client";

export default gql`
    query ToolModuleGroups {
        toolModuleGroups {
            name
        }
    }
`;