import graphene

from api.graphql.decorators import permission_required
from api.graphql.inputs.parameter import UpdateParameterInput
from api.graphql.payloads import ParameterPayload
from api.models import Unit
from api.models.tool_models import Parameter


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
