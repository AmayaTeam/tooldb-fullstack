import { gql } from "@apollo/client";

export default gql`
    query RecordPointUnitByUnitSystem($unitSystemId: String!) {
        recordPointUnitByUnitSystem(unitSystemId: $unitSystemId) {
            id
            name {
              en
            }
        }
    }
`;