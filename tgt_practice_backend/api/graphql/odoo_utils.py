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
            logger.info(row)
            ODOO_id = row['id']
            serial = row["serial"]
            group = row["group_id/display_name"] if row["group_id/display_name"] != "" else "Unknown"
            group = ToolModuleGroup.objects.filter(name=group).first()
            module = row["group_category_id/display_name"] if row["group_category_id/display_name"] != "" else "Unknown"
            module = ToolModuleType.objects.filter(name=module, r_modules_group=group).first()

            weight_unit = row["weight_uom_id/display_name"]
            weight_value = row["weight"]
            diameter_unit = row["diameter_uom_id/display_name"]
            diameter_value = row["outer_diameter"]

            tool_module = ToolModule.objects.filter(odoo_id=ODOO_id).first()
            logger.info(f"tool_module: {bool(tool_module)}, {tool_module}")

            if tool_module:
                pass
            else:
                if group is None and module is None:
                    new_group = ToolModuleGroup(
                        name=row["group_id/display_name"] if row["group_id/display_name"] != "" else "Unknown")
                    new_group_list.append(new_group)
                    new_module_type = ToolModuleType(name=row["group_category_id/display_name"] if row["group_category_id/display_name"] != "" else "Unknown",
                                                     r_modules_group=new_group)
                    new_module_type_list.append(new_module_type)
                    new_tool_module = ToolModule(
                        odoo_id=ODOO_id,
                        r_module_type=new_module_type,
                        sn=serial,
                    )
                    new_module_list.append(new_tool_module)

                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=weight_unit if weight_unit else "kg"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="Weight"),
                            parameter_value=weight_value if weight_value else 0.0,
                        )
                    )
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=diameter_unit if diameter_unit else "mm"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="OD"),
                            parameter_value=diameter_value if diameter_value else 0.0,
                        )
                    )
                else:
                    new_group_list.append(group)
                    new_module_type_list.append(module)
                    new_tool_module = ToolModule(
                        odoo_id=ODOO_id,
                        r_module_type=module,
                        sn=serial,
                    )

                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=weight_unit if weight_unit else "kg"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="Weight"),
                            parameter_value=weight_value if weight_value else 0.0,
                        )
                    )
                    new_parameters.append(
                        Parameter(
                            unit=Unit.objects.get(name__en=diameter_unit if diameter_unit else "mm"),
                            toolmodule=new_tool_module,
                            parameter_type=ParameterType.objects.get(parameter_name="OD"),
                            parameter_value=diameter_value if diameter_value else 0.0,
                        )
                    )
        unique_names = set()
        filtered_group_list = []
        for group in new_group_list:
            if group.name not in unique_names:
                unique_names.add(group.name)
                filtered_group_list.append(group)

        logger.info(f"new_module_list: {new_module_list}")
        logger.info(f"modified_module_list: {modified_module_list}")
        logger.info(f"new_parameters: {new_parameters}")
        logger.info(f"modified_parameters: {modified_parameters}")
        logger.info(f"new_group_list: {new_group_list}")
        logger.info(f"new_module_type_list: {new_module_type_list}")
        return new_module_list, modified_module_list, new_parameters, modified_parameters, filtered_group_list, new_module_type_list, errors
