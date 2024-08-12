import { gql } from "@apollo/client";

export const CREATE_SENSOR = gql`
    mutation createToolInstalledSensor($input: CreateToolInstalledSensorInput!) {
        createToolInstalledSensor(input: $input) {
            toolInstalledSensor {
                id
            }
        }
    }
`