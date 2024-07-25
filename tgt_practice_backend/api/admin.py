from django.contrib import admin

from api.models.user_models import Profile
from api.models.sensor_models import ToolSensorType, ToolInstalledSensor
from api.models.tool_models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    ParameterType,
    Parameter,
)
from api.models.unit_system_models import (
    ResourceString,
    Unit,
    UnitSystem,
    Measure,
    MeasureUnit,
    UnitSystemMeasureUnit,
    ConversionFactor
)


@admin.register(ToolModuleGroup)
class ToolModuleGroupAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    list_display_links = ("name",)


@admin.register(ToolModuleType)
class ToolModuleTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "r_modules_group", "module_type", "hash_code")
    search_fields = ("name", "hash_code")
    list_display_links = ("name",)


@admin.register(ToolModule)
class ToolModuleAdmin(admin.ModelAdmin):
    list_display = (
        "sn",
        "r_module_type",
        "dbdate",
        "dbversion",
        "dbsn",
        "dbcomment",
        "dbtname",
        "status"
    )
    search_fields = (
        "sn",
        "dbdate",
        "dbversion",
        "dbsn",
        "dbcomment",
        "dbtname",
        "status"
    )
    list_display_links = ("sn",)


@admin.register(ToolSensorType)
class ToolSensorTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "sensor")
    search_fields = ("name",)
    list_display_links = ("name",)


@admin.register(ToolInstalledSensor)
class ToolInstalledSensorAdmin(admin.ModelAdmin):
    list_display = ("r_toolmodule", "r_toolsensortype", "record_point", "unit")
    search_fields = ("r_toolmodule", "r_toolsensortype", "record_point", "unit")
    list_display_links = ("r_toolmodule", "r_toolsensortype")


@admin.register(ParameterType)
class ParameterTypeAdmin(admin.ModelAdmin):
    list_display = ("parameter_name", "default_measure")
    search_fields = ("parameter_name", "default_measure")
    list_display_links = ("parameter_name",)


@admin.register(Parameter)
class ParameterAdmin(admin.ModelAdmin):
    list_display = ("unit", "toolmodule", "parameter_type", "parameter_value")
    search_fields = ("toolmodule", "parameter_type",)
    list_display_links = ("toolmodule", "parameter_type")


@admin.register(ResourceString)
class ResourceStringAdmin(admin.ModelAdmin):
    list_display = ("en", "ru", "es",)
    search_fields = ("en", "ru", "es",)
    list_display_links = ("en", "ru", "es",)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("name", "html_name", "id_unisum")
    search_fields = ("name", "html_name")
    list_display_links = ("name", "html_name")


@admin.register(UnitSystem)
class UnitSystemAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    list_display_links = ("name",)


@admin.register(Measure)
class MeasureAdmin(admin.ModelAdmin):
    list_display = ("name", "default_unit", "id_unisum")
    search_fields = ("name", "default_unit", "id_unisum")
    list_display_links = ("name", "default_unit")


@admin.register(MeasureUnit)
class MeasureUnitAdmin(admin.ModelAdmin):
    list_display = ("measure", "unit")
    search_fields = ("measure", "unit")
    list_display_links = ("measure", "unit")


@admin.register(UnitSystemMeasureUnit)
class UnitSystemMeasureUnit(admin.ModelAdmin):
    list_display = ("measure_unit", "unit_system")
    search_fields = ("measure_unit", "unit_system")
    list_display_links = ("measure_unit", "unit_system")


@admin.register(ConversionFactor)
class ConversionFactorAdmin(admin.ModelAdmin):
    list_display = ("from_unit", "to_unit", "factor_1", "factor_2")
    search_fields = ("from_unit", "to_unit", "factor_1", "factor_2")
    list_display_links = ("from_unit", "to_unit")


@admin.register(Profile)
class Profile(admin.ModelAdmin):
    list_display = ("unitsystem", "user", "language")
