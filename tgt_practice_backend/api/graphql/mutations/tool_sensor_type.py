import graphene

from django.core.exceptions import ObjectDoesNotExist

from api.graphql.inputs.tool_sensor_type import (
    CreateToolSensorTypeInput,
    UpdateToolSensorTypeInput,
    DeleteToolSensorTypeInput,
)
from api.graphql.payloads import ToolSensorTypePayload, DeletePayload
from api.models import ToolSensorType
from api.graphql.decorators import permission_required


class CreateToolSensorType(graphene.Mutation):
    class Arguments:
        input = CreateToolSensorTypeInput(required=True)

    Output = ToolSensorTypePayload

    @classmethod
    @permission_required("api.add_toolsensortype")
    def mutate(cls, root, info, input):
        tool_sensor_type = ToolSensorType.objects.create(
            name=input.name,
            sensor_id=input.sensor_id,
        )
        return ToolSensorTypePayload(tool_sensor_type=tool_sensor_type)


class UpdateToolSensorType(graphene.Mutation):
    class Arguments:
        input = UpdateToolSensorTypeInput(required=True)

    Output = ToolSensorTypePayload

    @classmethod
    @permission_required("api.change_toolsensortype")
    def mutate(cls, root, info, input):
        try:
            tool_sensor_type = ToolSensorType.objects.get(pk=input.id)
        except ObjectDoesNotExist:
            raise Exception("ToolSensorType not found")

        for field, value in input.items():
            if field != "id":
                setattr(tool_sensor_type, field, value)

        tool_sensor_type.save()

        return ToolSensorTypePayload(tool_sensor_type=tool_sensor_type)


class DeleteToolSensorType(graphene.Mutation):
    class Arguments:
        input = DeleteToolSensorTypeInput(required=True)

    Output = DeletePayload

    @classmethod
    @permission_required("api.delete_toolsensortype")
    def mutate(cls, root, info, input):
        try:
            tool_sensor_type = ToolSensorType.objects.get(pk=input.id)
            tool_sensor_type.delete()
            return DeletePayload(success=True)
        except ObjectDoesNotExist:
            return DeletePayload(success=False)
