import graphene


class CreateToolModuleGroupInput(graphene.InputObjectType):
    name = graphene.String()


class UpdateToolModuleGroupInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    name = graphene.String()


class DeleteToolModuleGroupInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
