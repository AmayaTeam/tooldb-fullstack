import graphene


class CreateParameterInput(graphene.InputObjectType):
    toolmodule_id = graphene.UUID(required=True)
    parameter_type = graphene.UUID(required=True)
    parameter_value = graphene.Float(required=True)
    unit_id = graphene.UUID(required=True)


class UpdateParameterInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    unit_id = graphene.UUID()
    parameter_value = graphene.Float()
