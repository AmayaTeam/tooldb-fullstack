import base64
import datetime
import os

from django.contrib.auth.models import User, Group, Permission
from django.core.management import BaseCommand
import json

from api.models.unit_system_models import Measure, Unit
from api.models.sensor_models import ToolSensorType, ToolInstalledSensor
from api.models.tool_models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    ParameterType,
    Parameter,
)


class Command(BaseCommand):
    help = "add_base_data_large"

    @staticmethod
    def add_tool_module_group(tool_module_group_data):
        for tool_module_group_element in tool_module_group_data:
            id = tool_module_group_element["id"]
            name = tool_module_group_element["name"]
            ToolModuleGroup.objects.create(id=id, name=name)

    @staticmethod
    def add_tool_module_type(tool_module_type_data):
        for tool_module_type_element in tool_module_type_data:
            id = tool_module_type_element["id"]
            name = tool_module_type_element["name"]
            r_modules_group_id = tool_module_type_element["r_modules_group_id"]
            tool_module_group = ToolModuleGroup.objects.filter(
                id=r_modules_group_id
            ).first()
            module_type_id = tool_module_type_element["module_type_id"]
            hash_code = tool_module_type_element["hash_code"]
            ToolModuleType.objects.create(
                id=id,
                name=name,
                module_type=module_type_id,
                hash_code=hash_code,
                r_modules_group=tool_module_group,
            )

    @staticmethod
    def add_tool_module(tool_module_data):
        tool_modules = []
        for tool_module_element in tool_module_data:
            id = tool_module_element["id"]
            r_module_type_id = tool_module_element["r_module_type_id"]
            tool_module_type = ToolModuleType.objects.filter(
                id=r_module_type_id
            ).first()
            sn_ = tool_module_element["sn_"]
            dbdate_ = (
                datetime.datetime.strptime(
                    tool_module_element["dbdate_"], "%Y-%m-%d"
                ).date()
                if tool_module_element["dbdate_"]
                else None
            )
            dbversion_ = tool_module_element["dbversion_"]
            dbsn_ = tool_module_element["dbsn_"]
            dbcomment_ = tool_module_element["dbcomment_"]
            dbtname_ = tool_module_element["dbtname_"]
            image_path = (
                f"api/management/data/Image2D/{tool_module_element['dbtimage2d_']}"
            )
            if os.path.exists(image_path):
                with open(image_path, "rb") as f:
                    image_bytes = f.read()
                    image_str = base64.b64encode(image_bytes).decode("utf-8")

            tool_module = ToolModule(
                id=id,
                r_module_type=tool_module_type,
                sn=sn_,
                dbdate=dbdate_,
                dbversion=dbversion_,
                dbsn=dbsn_,
                dbcomment=dbcomment_,
                dbtname=dbtname_,
                image=image_str,
            )
            tool_modules.append(tool_module)
        return tool_modules

    @staticmethod
    def add_parameter_type(parameter_type_data):
        for parameter_type_element in parameter_type_data:
            name = parameter_type_element["name"]
            default_measure = Measure.objects.filter(name__en=parameter_type_element["default_measure"]).first()
            ParameterType.objects.create(
                parameter_name=name,
                default_measure=default_measure
            )

    @staticmethod
    def add_parameter(parameter_data):
        parameters = []
        for parameter_element in parameter_data:
            if (parameter_element["parameter_type"] == "COMP STR"
                    or parameter_element["parameter_type"] == "Weight"):
                unit = Unit.objects.filter(name__en="kg").first()
            else:
                unit = Unit.objects.filter(name__en="mm").first()

            toolmodule = ToolModule.objects.filter(
                id=parameter_element["toolmodule"]
            ).first()
            parameter_type = ParameterType.objects.filter(
                parameter_name=parameter_element["parameter_type"]
            ).first()
            parameter_value = parameter_element["parameter_value"]
            parameter = Parameter(
                unit=unit,
                toolmodule=toolmodule,
                parameter_type=parameter_type,
                parameter_value=parameter_value,
            )
            parameters.append(parameter)
        return parameters

    @staticmethod
    def add_tool_sensor_type(tool_sensor_type_data):
        for tool_sensor_type_element in tool_sensor_type_data:
            id = tool_sensor_type_element["id"]
            name = tool_sensor_type_element["name"]
            sensor_id = tool_sensor_type_element["sensor_id"]
            ToolSensorType.objects.create(
                id=id,
                name=name,
                sensor=sensor_id,
            )

    @staticmethod
    def add_tool_installed_sensor(tool_installed_sensor_data):
        sensors = []
        for tool_installed_sensor_element in tool_installed_sensor_data:
            id = tool_installed_sensor_element["id"]
            r_toolmodule_id = tool_installed_sensor_element["r_toolmodule_id"]
            tool_module = ToolModule.objects.filter(id=r_toolmodule_id).first()
            r_toolsensortype_id = tool_installed_sensor_element["r_toolsensortype_id"]
            toolsensortype = ToolSensorType.objects.filter(
                id=r_toolsensortype_id
            ).first()
            record_point_ = float(tool_installed_sensor_element["record_point_"])
            unit = Unit.objects.filter(name__en=tool_installed_sensor_element["unit"]).first()
            sensor = ToolInstalledSensor(
                id=id,
                r_toolmodule=tool_module,
                r_toolsensortype=toolsensortype,
                record_point=record_point_,
                unit=unit,
            )
            sensors.append(sensor)
        return sensors

    def handle(self, *args, **kwargs):
        tool_module_group_filepath = "api/management/data/Base/tool_module_group.json"
        tool_module_type_filepath = "api/management/data/Base/tool_module_type.json"
        tool_module_filepath = "api/management/data/Large/tool_module_large.json"
        parameter_type_filepath = "api/management/data/Base/parameter_type.json"
        parameter_filepath = "api/management/data/Base/parameter.json"
        tool_sensor_type_filepath = "api/management/data/Base/tool_sensor_type.json"
        tool_installed_sensor_filepath = (
            "api/management/data/Base/tool_installed_sensor.json"
        )

        with open(
            tool_module_group_filepath, "r", encoding="utf-8"
        ) as tool_module_group_file:
            tool_module_group_data = json.load(tool_module_group_file)

        with open(
            tool_module_type_filepath, "r", encoding="utf-8"
        ) as tool_module_type_file:
            tool_module_type_data = json.load(tool_module_type_file)

        with open(
            parameter_type_filepath, "r", encoding="utf-8"
        ) as parameter_type_file:
            parameter_type_data = json.load(parameter_type_file)

        with open(parameter_filepath, "r", encoding="utf-8") as parameter_file:
            parameter_data = json.load(parameter_file)

        with open(
            tool_sensor_type_filepath, "r", encoding="utf-8"
        ) as tool_sensor_type_file:
            tool_sensor_type_data = json.load(tool_sensor_type_file)

        with open(tool_module_filepath, "r", encoding="utf-8") as tool_module_file:
            tool_module_data = json.load(tool_module_file)

        with open(
            tool_installed_sensor_filepath, "r", encoding="utf-8"
        ) as tool_installed_sensor_file:
            tool_installed_sensor_data = json.load(tool_installed_sensor_file)

        self.add_tool_module_group(tool_module_group_data)
        print("ToolModulesGroup created")
        self.add_tool_module_type(tool_module_type_data)
        print("ToolModuleTypes created")
        ToolModule.objects.bulk_create(self.add_tool_module(tool_module_data))
        print("ToolModules created")
        self.add_parameter_type(parameter_type_data)
        print("ParameterType created")
        Parameter.objects.bulk_create(self.add_parameter(parameter_data))
        print("Parameters created")
        self.add_tool_sensor_type(tool_sensor_type_data)
        print("ToolSensorTypes created")
        ToolInstalledSensor.objects.bulk_create(
            self.add_tool_installed_sensor(tool_installed_sensor_data)
        )
        print("ToolInstalledSensors created")

        manager_group = Group.objects.create(name="manager")
        user_group = Group.objects.create(name="user")
        print("Groups created")

        # CRUD для manager
        permissions = Permission.objects.filter(content_type__app_label="api")
        manager_group.permissions.set(permissions)
        print("Permissions created")

        # Только чтение для user
        user_permissions = Permission.objects.filter(
            content_type__app_label="api", codename__startswith="view"
        )
        user_group.permissions.set(user_permissions)

        User.objects.create_superuser(
            "admin", "admin@admin.com", "admin", is_staff=True
        ).groups.add(manager_group)
        User.objects.create_user(
            "simple_user", "simple@user.com", "simple_user", is_staff=True
        ).groups.add(user_group)
        print("Users created")
