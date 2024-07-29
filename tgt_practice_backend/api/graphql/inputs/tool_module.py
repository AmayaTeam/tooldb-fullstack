import graphene


class CreateToolModuleInput(graphene.InputObjectType):
    r_module_type_id = graphene.UUID(required=True)
    sn = graphene.String(required=True)
    dbsn = graphene.String(required=False)
    dbtname = graphene.String(required=True)
    dbdate = graphene.Date()
    dbversion = graphene.String()
    dbcomment = graphene.String()
    image = graphene.String()


# изменение любого поля toolmodule
class UpdateToolModuleInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    r_module_type_id = graphene.UUID()
    sn = graphene.String()
    dbsn = graphene.String()
    dbtname = graphene.String()
    dbdate = graphene.Date()
    dbversion = graphene.String()
    dbcomment = graphene.String()
    image = graphene.String()


# удаление объекта ToolModule по id
class DeleteToolModuleInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
