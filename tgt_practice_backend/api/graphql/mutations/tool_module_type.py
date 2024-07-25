import graphene
from django.core.exceptions import ObjectDoesNotExist

from api.graphql.inputs.tool_module_type import (
    CreateToolModuleTypeInput,
    UpdateToolModuleTypeInput,
    DeleteToolModuleTypeInput,
)
from api.graphql.payloads import ToolModuleTypePayload, DeletePayload
from api.models import ToolModuleType, ToolModuleGroup
from api.graphql.decorators import permission_required


class CreateToolModuleType(graphene.Mutation):
    class Arguments:
        input = CreateToolModuleTypeInput(required=True)

    Output = ToolModuleTypePayload

    @classmethod
    @permission_required("api.add_toolmoduletype")
    def mutate(cls, root, info, input):
        try:
            tool_module_group = ToolModuleGroup.objects.get(pk=input.r_module_group)
        except ObjectDoesNotExist:
            raise Exception("Tool Module Group does not exist")
        tool_module_type = ToolModuleType.objects.create(
            r_modules_group_id=tool_module_group,
            name=input.name,
            module_type=input.module_type,
            hash_code=input.hash_code,
        )
        return ToolModuleTypePayload(tool_module_type=tool_module_type)


class UpdateToolModuleType(graphene.Mutation):
    class Arguments:
        input = UpdateToolModuleTypeInput(required=True)

    Output = ToolModuleTypePayload

    @classmethod
    @permission_required("api.change_toolmoduletype")
    def mutate(cls, root, info, input):
        try:
            tool_module_type = ToolModuleType.objects.get(pk=input.id)
        except ObjectDoesNotExist:
            raise Exception("ToolModuleType not found")
        if "r_module_group_id" in input:
            try:
                tool_module_group = ToolModuleGroup.objects.get(
                    pk=input.r_module_group_id
                )
                tool_module_type.r_modules_group_id = tool_module_group
            except ObjectDoesNotExist:
                raise Exception("Tool Module Group does not exist")

        for field, value in input.items():
            if field != "id" and field != "r_modules_group_id":
                setattr(tool_module_type, field, value)

        tool_module_type.save()

        return ToolModuleTypePayload(tool_module_type=tool_module_type)


class DeleteToolModuleType(graphene.Mutation):
    class Arguments:
        input = DeleteToolModuleTypeInput(required=True)

    Output = DeletePayload

    @classmethod
    @permission_required("api.delete_toolmoduletype")
    def mutate(cls, root, info, input):
        try:
            tool_module_type = ToolModuleType.objects.get(pk=input.id)
            tool_module_type.delete()
            return DeletePayload(success=True)
        except ObjectDoesNotExist:
            return DeletePayload(success=False)
