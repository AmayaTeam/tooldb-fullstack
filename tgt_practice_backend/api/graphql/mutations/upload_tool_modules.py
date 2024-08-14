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
    Parameter
)

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
        # ToolModuleGroup.objects.bulk_create(input.new_group_list)
        # ToolModuleType.objects.bulk_create(input.new_module_type_list)
        # ToolModule.objects.bulk_create(input.new_module_list)
        # Parameter.objects.bulk_create(input.new_parameter_list)
        logger.info("i'm here")
        new_module_list = []
        new_module_group_list = []
        new_module_type_list = []
        data = json.loads(input["data"])
        for elem in data["newModuleList"]:
            logger.info("i'm here")
            logger.info(elem)
            logger.info(elem["rModuleType"]["rModulesGroup"]["name"])
            logger.info(elem["rModuleType"]["name"])
            new_tool_module_group, created = ToolModuleGroup.objects.get_or_create(name=elem["rModuleType"]["rModulesGroup"]["name"])
            new_module_group_list.append(new_tool_module_group)
            logger.info(created)
            new_tool_module_type, created = ToolModuleType.objects.get_or_create(name=elem["rModuleType"]["name"], r_module_group=new_tool_module_group)
            new_module_type_list.append(new_tool_module_type)
            logger.info(created)
            new_module_list.append(
                ToolModule(
                    id=elem["id"],
                    odoo_id=elem["odoo_id"],
                    sn=elem["sn"],
                    rModuleType=new_tool_module_type
                    ),
                )
        logger.info(new_module_list)
        logger.info("group:", new_module_group_list)
        logger.info("type:", new_module_type_list)
        return UploadToolModulePayload(success=True)

