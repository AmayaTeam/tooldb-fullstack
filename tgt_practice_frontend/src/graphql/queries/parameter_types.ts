import { gql } from "@apollo/client";

export default gql`
query getParametersWithCurrentUnitSystem($unitSystemId: String!) {
    parametersWithUnitSystem(unitSystem:$unitSystemId) {
        parameterType {
            id
            parameterName
        }
        unit {
            id
            name {
                en
            }
        }
    }
}
`