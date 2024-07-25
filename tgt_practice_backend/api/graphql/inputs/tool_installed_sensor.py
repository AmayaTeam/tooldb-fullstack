import graphene


class CreateToolInstalledSensorInput(graphene.InputObjectType):
    r_toolmodule_id = graphene.UUID(required=True)
    r_toolsensortype_id = graphene.UUID(required=True)
    record_point = graphene.Float()
    unit_id = graphene.UUID(required=True)


# изменение поля record_point по id toolinstalledsensor
class UpdateToolInstalledSensorInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    record_point = graphene.Float(required=True)
    unit_id = graphene.UUID(required=True)


# удаление объекта ToolInstalledSensor по id
class DeleteToolInstalledSensorInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
