import { gql } from "@apollo/client";

export default gql`
query ToolSensorTypes {
  toolSensorTypes {
    id
    name
  }
}
`