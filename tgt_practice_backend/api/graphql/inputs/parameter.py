import graphene

class UpdateParameterInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    unit_id = graphene.UUID()
    parameter_value = graphene.Float()