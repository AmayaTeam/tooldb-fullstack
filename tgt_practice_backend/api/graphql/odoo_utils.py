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
        new_parameters = []
        modified_parameters = []
        new_group_list = []
        new_module_type_list = []
        errors = []
        for row in reader:
            odoo_id = row["id"]
            serial = row["serial"]
            group = row["group_id/display_name"]
            module = row["group_category_id/display_name"]
            if (group != "" and module != "" and serial != "" and odoo_id != ""
                and group is not None and module is not None and serial is not None and odoo_id is not None):

                if ToolModuleGroup.objects.filter(name=group).exists():
                    # присваиваю новому модулю
                else:
                    new_tool_module_group = ToolModuleGroup(
                        name=group,
                    )
                    new_group_list.append(new_tool_module_group)
                    new_module_type = ToolModuleType(
                        name=module,
                        r_modules_group=new_tool_module_group,
                    )
                    new_module = ToolModule(
                        sn=serial,
                        odoo_id=
                    )













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
                logger.info(f"odoo_id: {odoo_id}")
                logger.info("i'm here")
                group = ToolModuleGroup.objects.filter(name=row["group_id/display_name"] if row["group_id/display_name"] is None else "Unknown").first()
                module_type = ToolModuleType.objects.filter(name=row["group_category_id/display_name"] if row["group_category_id/display_name"] is None else "Unknown").first()
                logger.info(f"group: {bool(group)}, {group}")
                logger.info(f"type: {bool(module_type)}, {module_type}")
                if group is None and module_type is None:
                    new_group = ToolModuleGroup(name=row["group_id/display_name"] if row["group_id/display_name"] is None else "Unknown")
                    new_group_list.append(new_group)
                    logger.info(f"new group: {new_group}")
                    new_module_type = ToolModuleType(name=row["group_category_id/display_name"] if row["group_category_id/display_name"] is None else "Unknown",
                                                     r_modules_group=new_group)
                    new_module_type_list.append(new_module_type)
                    logger.info(f"group: {bool(group)}, {group}")
                    logger.info(f"type: {bool(module_type)}, {type(module_type)}")
                    logger.info(f"module type: {module_type}")
                    new_tool_module = ToolModule(
                        odoo_id=odoo_id,
                        r_module_type=new_module_type,
                        sn=row["serial"],
                    )
                    new_module_list.append(new_tool_module)
                    logger.info(f"new module: {new_tool_module}")
                    # присвоить параметры
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(
                                name__en=row["weight_uom_id/display_name"] if row[
                                    "weight_uom_id/display_name"] else "kg"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="Weight"),
                            parameter_value=row["weight"] if row["weight"] else 0.0,
                        )
                    )
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=row["diameter_uom_id/display_name"] if row[
                                "diameter_uom_id/display_name"] else "mm"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="OD"),
                            parameter_value=row["outer_diameter"] if row["outer_diameter"] else 0.0,
                        )
                    )
                else:
                    new_tool_module = ToolModule(
                        odoo_id=odoo_id,
                        r_module_type=module_type,
                        sn=row["serial"],
                    )
                    new_module_list.append(new_tool_module)
                    logger.info(f"new module: {new_tool_module}")
                    # присвоить параметры
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(
                                name__en=row["weight_uom_id/display_name"] if row[
                                    "weight_uom_id/display_name"] else "kg"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="Weight"),
                            parameter_value=row["weight"] if row["weight"] else 0.0,
                        )
                    )
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=row["diameter_uom_id/display_name"] if row[
                                "diameter_uom_id/display_name"] else "mm"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="OD"),
                            parameter_value=row["outer_diameter"] if row["outer_diameter"] else 0.0,
                        )
                    )
        logger.info(f"new_module_list: {new_module_list}")
        logger.info(f"modified_module_list: {modified_module_list}")
        logger.info(f"new_parameters: {new_parameters}")
        logger.info(f"modified_parameters: {modified_parameters}")
        logger.info(f"new_group_list: {new_group_list}")
        logger.info(f"new_module_type_list: {new_module_type_list}")
        return new_module_list, modified_module_list, new_parameters, modified_parameters, new_group_list, new_module_type_list, errors
