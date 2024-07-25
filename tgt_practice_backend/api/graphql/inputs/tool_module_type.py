import graphene


class CreateToolModuleTypeInput(graphene.InputObjectType):
    r_module_group = graphene.UUID(required=True)
    name = graphene.String(required=True)
    module_type = graphene.String(required=False)
    hash_code = graphene.String(required=False)


class UpdateToolModuleTypeInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    r_module_group_id = graphene.UUID(required=False)
    name = graphene.String(required=True)
    module_type_id = graphene.String(required=False)
    hash_code = graphene.String(required=False)


class DeleteToolModuleTypeInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
