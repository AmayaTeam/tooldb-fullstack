import graphene
from django.contrib.auth.models import Group
from api.graphql.decorators import query_permission_required
from api.graphql.conversion_utils import ConversionUtils

from .types import (
    ParameterTypeUnitObject,
    ToolModuleGroupObject,
    ToolModuleTypeObject,
    ToolModuleObject,
    ToolSensorTypeObject,
    ToolInstalledSensorObject,
    UserType,
    GroupType,
    ParameterType,
    UnitSystemObject,
    ProfileObject,
)
from api.models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    ToolSensorType,
    ToolInstalledSensor,
    UnitSystem,
    Profile,
    ParameterTypeUnit,
    UnitSystemMeasureUnit,
    ConversionFactor,
)


class Query(graphene.ObjectType):
    tool_module_groups = graphene.List(ToolModuleGroupObject)
    tool_module_types = graphene.List(ToolModuleTypeObject)
    tool_modules = graphene.List(ToolModuleObject)
    tool_sensor_types = graphene.List(ToolSensorTypeObject)
    tool_installed_sensors = graphene.List(ToolInstalledSensorObject)

    tool_modules_by_id = graphene.Field(ToolModuleObject, id=graphene.String())
    tool_modules_by_id_with_unit_system = graphene.Field(
        ToolModuleObject,
        id=graphene.String(),
        unit_system=graphene.String(required=True),
    )
    profile_by_id = graphene.Field(ProfileObject, user_id=graphene.String())

    tool_module_types_by_group_id = graphene.List(
        ToolModuleTypeObject, group_id=graphene.String()
    )  # по айди группы отдает все пренадлежащие ей типы модулей БЕЗ ПРИБОРОВ
    tool_modules_by_module_type_id = graphene.List(
        ToolModuleObject, module_type_id=graphene.String()
    )  # по айди типа модуля отдает все приборы в рамках одного
    tool_modules_by_group_id = graphene.List(
        ToolModuleObject, group_id=graphene.String()
    )  # отдает всю вложенность в рамках айди группы

    unit_systems = graphene.List(UnitSystemObject)

    me = graphene.Field(UserType)
    groups = graphene.List(GroupType)

    parameters_with_unit_system = graphene.List(
        ParameterTypeUnitObject, unit_system=graphene.String(required=True)
    )

    def resolve_me(self, info):
        user = info.context.user
        return user

    def resolve_groups(self, info, **kwargs):
        return Group.objects.all()

    @query_permission_required("api.view_toolmodulegroup")
    def resolve_tool_module_groups(self, info, **kwargs):
        return ToolModuleGroup.objects.all()

    @query_permission_required("api.view_toolmoduletype")
    def resolve_tool_module_types(self, info, **kwargs):
        return ToolModuleType.objects.all()

    @query_permission_required("api.view_toolmodule")
    def resolve_tool_modules(self, info, **kwargs):
        return ToolModule.objects.all()

    @query_permission_required("api.view_toolmodule")
    def resolve_tool_modules_by_id(self, info, id):
        # Querying a single question
        return ToolModule.objects.get(pk=id)

    @query_permission_required("api.view_toolmoduletype")
    def resolve_tool_sensor_types(self, info, **kwargs):
        return ToolSensorType.objects.all()

    @query_permission_required("api.view_toolinstalledsensor")
    def resolve_tool_installed_sensors(self, info, **kwargs):
        return ToolInstalledSensor.objects.all()

    def resolve_unit_systems(self, info, **kwargs):
        return UnitSystem.objects.all()

    def resolve_profile_by_id(root, info, user_id):
        return Profile.objects.get(user__id=user_id)

    def resolve_tool_modules_by_id_with_unit_system(root, info, id, unit_system):
        tool_module = ToolModule.objects.get(pk=id)

        for parameter in tool_module.parameter_set.all():
            from_unit = parameter.unit
            to_unit = ConversionUtils.get_unit_for_measure_and_unit_system(
                parameter.parameter_type.default_measure, unit_system
            )
            conversion_factor = ConversionUtils.get_conversion_factor(
                from_unit, to_unit
            )

            if conversion_factor:
                parameter.parameter_value = ConversionUtils.convert_value(
                    parameter.parameter_value,
                    conversion_factor.factor_1,
                    conversion_factor.factor_2,
                )
                parameter.unit = to_unit
                parameter.save()

        return tool_module

    @query_permission_required("api.view_toolmoduletype")
    def resolve_tool_module_types_by_group_id(self, info, group_id):
        return ToolModuleType.objects.filter(r_modules_group_id=group_id).all()

    @query_permission_required("api.view_toolmodule")
    def resolve_tool_modules_by_module_type_id(self, info, module_type_id):
        return ToolModule.objects.filter(r_module_type_id=module_type_id).all()

    @query_permission_required("api.view_toolmodule")
    def resolve_tool_modules_by_group_id(self, info, group_id):
        return ToolModule.objects.filter(
            r_module_type_id__r_modules_group_id=group_id
        ).all()

    def resolve_parameters_with_unit_system(self, info, unit_system):

        param_types = ParameterType.objects.all()
        param_types_with_units = []

        for param_type in param_types:
            to_unit = ConversionUtils.get_unit_for_measure_and_unit_system(
                param_type.default_measure, unit_system
            )
            type_with_unit, created = ParameterTypeUnit.objects.get_or_create(
                parameter_type=param_type, unit=to_unit
            )
            param_types_with_units.append(type_with_unit)

        return param_types_with_units
