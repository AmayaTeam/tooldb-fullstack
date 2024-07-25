import graphene
from django.core.exceptions import ObjectDoesNotExist

from api.graphql.decorators import permission_required
from api.graphql.inputs.tool_installed_sensor import (
    CreateToolInstalledSensorInput,
    UpdateToolInstalledSensorInput,
    DeleteToolInstalledSensorInput,
)
from api.graphql.payloads import ToolInstalledSensorPayload, DeletePayload
from api.models import ToolModule, ToolSensorType, ToolInstalledSensor


class CreateToolInstalledSensor(graphene.Mutation):
    class Arguments:
        input = CreateToolInstalledSensorInput(required=True)

    Output = ToolInstalledSensorPayload

    @classmethod
    @permission_required("api.add_toolinstalledsensor")
    def mutate(cls, root, info, input):
        try:
            tool_module = ToolModule.objects.get(pk=input.r_toolmodule_id)
        except ObjectDoesNotExist:
            raise Exception("Tool module not found")

        try:
            tool_sensor_type = ToolSensorType.objects.get(pk=input.r_toolsensortype_id)
        except ObjectDoesNotExist:
            raise Exception("Tool sensor type not found")
        # get in try-except unit
        tool_installed_sensor = ToolInstalledSensor.objects.create(
            r_toolmodule=tool_module,
            r_toolsensortype=tool_sensor_type,
            record_point=input.record_point,
            # unit =
        )
        return ToolInstalledSensorPayload(tool_installed_sensor=tool_installed_sensor)


class UpdateToolInstalledSensor(graphene.Mutation):
    class Arguments:
        input = UpdateToolInstalledSensorInput(required=True)

    Output = ToolInstalledSensorPayload

    @classmethod
    @permission_required("api.change_toolinstalledsensor")
    def mutate(cls, root, info, input):
        try:
            tool_installed_sensor = ToolInstalledSensor.objects.get(pk=input.id)
        except ObjectDoesNotExist:
            raise Exception("Tool installed sensor not found")
        # get current unit, convert and update unit and record_point
        tool_installed_sensor.record_point = input.record_point
        tool_installed_sensor.save()

        return ToolInstalledSensorPayload(tool_installed_sensor=tool_installed_sensor)


class DeleteToolInstalledSensor(graphene.Mutation):
    class Arguments:
        input = DeleteToolInstalledSensorInput(required=True)

    Output = DeletePayload

    @classmethod
    @permission_required("api.delete_toolinstalledsensor")
    def mutate(cls, root, info, input):
        try:
            tool_installed_sensor = ToolInstalledSensor.objects.get(pk=input.id)
            tool_installed_sensor.delete()
            return DeletePayload(success=True)
        except ObjectDoesNotExist:
            return DeletePayload(success=False)
