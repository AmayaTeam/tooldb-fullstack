import graphene
from django.core.exceptions import ObjectDoesNotExist

from api.graphql.decorators import permission_required
from api.graphql.inputs.tool_module import (
    CreateToolModuleInput,
    UpdateToolModuleInput,
    DeleteToolModuleInput,
)
from api.graphql.payloads import ToolModulePayload, DeletePayload
from api.models import ToolModuleType, ToolModule


class CreateToolModule(graphene.Mutation):
    class Arguments:
        input = CreateToolModuleInput(required=True)

    Output = ToolModulePayload

    @classmethod
    @permission_required("api.add_toolmodule")
    def mutate(cls, root, info, input):
        try:
            tool_module_type = ToolModuleType.objects.get(pk=input.r_module_type_id)
        except ObjectDoesNotExist:
            raise Exception("Tool module type not found")

        tool_module = ToolModule.objects.create(
            r_module_type_id=tool_module_type,
            sn=input.sn,
            dbsn=input.dbsn,
            dbtname=input.dbtname,
            dbdate=input.dbdate,
            dbversion=input.dbversion,
            dbcomment=input.dbcomment,
            dbtlength=input.dbtlength,
            dbtweight=input.dbtweight,
            dbtmax_od=input.dbtmax_od,
            dbtmax_od_collapsed=input.dbtmax_od_collapsed,
            dbtmax_od_opened=input.dbtmax_od_opened,
            dbtimage_h_shift=input.dbtimage_h_shift,
            dbtimage_h_scale=input.dbtimage_h_scale,
            dbtimage_h_y1=input.dbtimage_h_y1,
            dbtimage_h_y2=input.dbtimage_h_y2,
            dbtcomp_str=input.dbtcomp_str,
            image=input.image,
        )
        return ToolModulePayload(tool_module=tool_module)


class UpdateToolModule(graphene.Mutation):
    class Arguments:
        input = UpdateToolModuleInput(required=True)

    Output = ToolModulePayload

    @classmethod
    @permission_required("api.change_toolmodule")
    def mutate(cls, root, info, input):
        try:
            tool_module = ToolModule.objects.get(pk=input.id)
        except ObjectDoesNotExist:
            raise Exception("Tool module not found")

        # при попытке изменить внешний ключ r_module_type_id,
        # делаем проверку на существование этой сущности
        if "r_module_type_id" in input:
            try:
                tool_module_type = ToolModuleType.objects.get(pk=input.r_module_type_id)
                tool_module.r_module_type_id = tool_module_type
            except ObjectDoesNotExist:
                raise Exception("Tool module type not found")

        # обновляем поля, если они предоставлены
        for field, value in input.items():
            # исключаем id из обновления
            # исключаем r_module_type_id (проверили его ранее)
            if field != "id" and field != "r_module_type_id":
                setattr(tool_module, field, value)

        tool_module.save()

        return ToolModulePayload(tool_module=tool_module)


class DeleteToolModule(graphene.Mutation):
    class Arguments:
        input = DeleteToolModuleInput(required=True)

    Output = DeletePayload

    @classmethod
    @permission_required("api.delete_toolmodule")
    def mutate(cls, root, info, input):
        try:
            tool_module = ToolModule.objects.get(pk=input.id)
            tool_module.delete()
            return DeletePayload(success=True)
        except ObjectDoesNotExist:
            return DeletePayload(success=False)
