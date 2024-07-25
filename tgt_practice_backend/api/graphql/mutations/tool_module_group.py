import graphene
from django.core.exceptions import ObjectDoesNotExist

from api.graphql.inputs.tool_module_group import (
    CreateToolModuleGroupInput,
    UpdateToolModuleGroupInput,
    DeleteToolModuleGroupInput,
)
from api.graphql.payloads import ToolModuleGroupPayload, DeletePayload
from api.models import ToolModuleGroup
from api.graphql.decorators import permission_required


class CreateToolModuleGroup(graphene.Mutation):
    class Arguments:
        input = CreateToolModuleGroupInput(required=True)

    Output = ToolModuleGroupPayload

    @classmethod
    @permission_required("api.add_toolmodulegroup")
    def mutate(cls, root, info, input):
        tool_module_group = ToolModuleGroup.objects.create(
            name=input.name,
        )
        return ToolModuleGroupPayload(tool_module_group=tool_module_group)


class UpdateToolModuleGroup(graphene.Mutation):
    class Arguments:
        input = UpdateToolModuleGroupInput(required=True)

    Output = ToolModuleGroupPayload

    @classmethod
    @permission_required("api.change_toolmodulegroup")
    def mutate(cls, root, info, input):
        try:
            tool_module_group = ToolModuleGroup.objects.get(pk=input.id)
        except ObjectDoesNotExist:
            raise Exception("ToolModuleGroup not found")

        for field, value in input.items():
            if field != "id":
                setattr(tool_module_group, field, value)

        tool_module_group.save()

        return ToolModuleGroupPayload(tool_module_group=tool_module_group)


class DeleteToolModuleGroup(graphene.Mutation):
    class Arguments:
        input = DeleteToolModuleGroupInput(required=True)

    Output = DeletePayload

    @classmethod
    @permission_required("api.delete_toolmodulegroup")
    def mutate(cls, root, info, input):
        try:
            tool_module_group = ToolModuleGroup.objects.get(pk=input.id)
            tool_module_group.delete()
            return DeletePayload(success=True)
        except ObjectDoesNotExist:
            return DeletePayload(success=False)
