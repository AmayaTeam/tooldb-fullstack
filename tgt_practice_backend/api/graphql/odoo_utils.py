import csv
import logging
import base64
import uuid
from io import StringIO

from api.models.unit_system_models import Measure, Unit
from api.models.sensor_models import ToolSensorType, ToolInstalledSensor
from api.models.tool_models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    ParameterType,
    Parameter,
)

logger = logging.getLogger('odoo')


class ODOOUtils:
    def analyse_file(f):
        logger.info("CSV FILE UPLOAD!")
        buffer = StringIO(f)
        reader = csv.DictReader(buffer, skipinitialspace=True)

        new_module_list = []
        modified_module_list = []
        errors = []
        for row in reader:
            logger.info(row)
            ODOO_id = row['id']
            tool_module = ToolModule.objects.filter(odoo_id=ODOO_id).first()
            logger.info(f"tool_module: {bool(tool_module)}, {tool_module}")
            if tool_module:
                pass
                # new_module_list.append(
                #     ToolModule(
                #         odoo_id=odoo_id,
                #         name=row["group_id/display_name"]
                #     )
                # )
                # у этого модуля брать все его параметры и заменять на пришедшие из csv
            else:
                odoo_id = ODOO_id
                # проверить есть ли такая группа, модуль и присвоить её
                group = ToolModuleGroup.objects.filter(name=row["group_id/display_name"]).first()
                module_type = ToolModuleType.objects.filter(name=row["group_category_id/display_name"]).first()
                logger.info(f"group: {bool(group)}, {group}")
                logger.info(f"type: {bool(module_type)}, {module_type}")
                if group is None and module_type is None:
                    group, created = ToolModuleGroup.objects.get_or_create(name="Unknown")
                    logger.info(group)
                    module_type, created = ToolModuleType.objects.get_or_create(name="Unknown",
                                                                                r_modules_group_id=group)
                    logger.info(f"group: {bool(group)}, {group}")
                    logger.info(f"type: {bool(module_type)}, {module_type}")
                    logger.info(module_type)
                new_module_list.append(
                    ToolModule(
                        id=uuid.uuid4().hex,
                        odoo_id=odoo_id,
                        r_module_type=module_type,
                        sn=row["serial"],
                    )
                )

                # # присвоить параметры
                # parameters = [
                #     Parameter(
                #         unit=Unit.objects.get(name__en=row["weight_uom_id/display_name"] if row["weight_uom_id/display_name"] else "kg"),
                #         tool_module=new_tool_module,
                #         parameter_type=ParameterType.objects.get("Weight"),
                #         parameter_value=row["weight"] if row["weight"] else 0.0,
                #     ),
                #     Parameter(
                #         unit=Unit.objects.get(name__en=row["diameter_uom_id/display_name"] if row["diameter_uom_id/display_name"] else "mm"),
                #         tool_module=new_tool_module,
                #         parameter_type=ParameterType.objects.get("OD"),
                #         parameter_value=row["outer_diameter"] if row["outer_diameter"] else 0.0,
                #     ),
                #
                # ]
        logger.info(f"new_module_list: {new_module_list}")
        logger.info(f"modified_module_list: {modified_module_list}")
        return new_module_list, modified_module_list, errors
