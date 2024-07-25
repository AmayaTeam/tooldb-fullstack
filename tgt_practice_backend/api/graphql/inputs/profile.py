import graphene

class UpdateProfileInput(graphene.InputObjectType):
    user_id = graphene.ID(required=True)
    unitsystem_id = graphene.UUID(required=False)
    language = graphene.String(required=False)
