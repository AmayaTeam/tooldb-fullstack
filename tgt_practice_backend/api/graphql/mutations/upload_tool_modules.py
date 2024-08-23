import json
import logging

import graphene
from django.core.exceptions import ObjectDoesNotExist

from api.graphql.decorators import permission_required
from api.graphql.inputs.upload_tool_modules import UploadToolModuleInput
from api.graphql.payloads import UploadToolModulePayload

from api.models.tool_models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    Parameter,
    ParameterType
)

from api.models.unit_system_models import Unit

logger = logging.getLogger('odoo')

class UploadToolModules(graphene.Mutation):
    class Arguments:
        input = UploadToolModuleInput(required=True)

    Output = UploadToolModulePayload

    @classmethod
    @permission_required("api.add_toolmodule")
    @permission_required("api.add_parameter")
    @permission_required("api.add_toolmodulegroup")
    @permission_required("api.add_toolmoduletype")
    def mutate(cls, root, info, input):
        # logger.info("i'm here")
        new_module_list = []
        new_parameters = []
        data = json.loads(input["data"])
        for group in data["newGroupList"]:
            ToolModuleGroup.objects.create(
                name=group["name"],
            )
        # new_module_type_list = []
        for module in data["newModuleList"]:
            module_type = ToolModuleType.objects.get_or_create(name=module["rModuleType"]["name"], r_modules_group=ToolModuleGroup.objects.filter(name=module["rModuleType"]["rModulesGroup"]["name"]).first())[0]
            new_module_list.append(
                ToolModule(
                    id=module["id"],
                    odoo_id=module["odooId"],
                    sn=module["sn"],
                    r_module_type=module_type,
                )
            )
        for parameter in data["newParameters"]:
            new_parameters.append(
                Parameter(
                    id=parameter["id"],
                    parameter_type=ParameterType.objects.get(parameter_name=parameter["parameterType"]["parameterName"]),
                    parameter_value=parameter["parameterValue"],
                    unit=Unit.objects.get(name__en=parameter["unit"]["name"]["en"]),
                    toolmodule=ToolModule.objects.filter(id=parameter["toolmodule"]["id"]).first(),
                )
            )
        ToolModule.objects.bulk_create(new_module_list)
        Parameter.objects.bulk_create(new_parameters)
        return UploadToolModulePayload(success=True)

