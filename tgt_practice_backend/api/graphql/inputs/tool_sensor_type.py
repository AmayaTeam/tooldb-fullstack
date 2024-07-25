import graphene


class CreateToolSensorTypeInput(graphene.InputObjectType):
    name = graphene.String()
    sensor_id = graphene.String()


class UpdateToolSensorTypeInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    name = graphene.String()
    sensor_id = graphene.String()


class DeleteToolSensorTypeInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
