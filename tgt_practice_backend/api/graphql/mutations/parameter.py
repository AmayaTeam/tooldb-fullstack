import graphene

from api.graphql.decorators import permission_required
from api.graphql.inputs.parameter import UpdateParameterInput
from api.graphql.payloads import ParameterPayload

from api.graphql.inputs.parameter import CreateParameterInput
from api.models.tool_models import ToolModule, ParameterType, Parameter
from api.models.unit_system_models import Unit


class CreateParameter(graphene.Mutation):
    class Arguments:
        input = CreateParameterInput(required=True)

    Output = ParameterPayload

    @classmethod
    @permission_required("api.add_parameter")
    def mutate(cls, root, info, input):
        parameter = Parameter.objects.create(
            unit=Unit.objects.get(pk=input["unit_id"]),
            toolmodule=ToolModule.objects.get(pk=input["toolmodule_id"]),
            parameter_type=ParameterType.objects.get(pk=input["parameter_type"]),
            parameter_value=input["parameter_value"],
        )
        return ParameterPayload(parameter=parameter)


class UpdateParameter(graphene.Mutation):
    class Arguments:
        input = UpdateParameterInput(required=True)

    Output = ParameterPayload

    @classmethod
    @permission_required("api.change_parameter")
    def mutate(cls, root, info, input):
        try:
            parameter = Parameter.objects.get(pk=input.id)
        except Parameter.DoesNotExist:
            raise Exception("Parameter not found")

        if "unit_id" in input:
            try:
                unit = Unit.objects.get(pk=input.unit_id)
                parameter.unit = unit
            except Unit.DoesNotExist:
                raise Exception("Unit not found")

        if "parameter_value" in input:
            parameter.parameter_value = input.parameter_value

        parameter.save()

        return ParameterPayload(parameter=parameter)
