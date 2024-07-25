from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from graphene_django import DjangoObjectType

from api.models.user_models import Profile
from api.models.unit_system_models import (
    ResourceString,
    Unit,
    UnitSystem,
    Measure,
    MeasureUnit,
    UnitSystemMeasureUnit,
    ConversionFactor
)
from api.models.sensor_models import (
    ToolSensorType,
    ToolInstalledSensor
)
from api.models.tool_models import (
    ToolModuleGroup,
    ToolModuleType,
    ToolModule,
    ParameterType,
    Parameter
)


class ToolModuleGroupObject(DjangoObjectType):
    class Meta:
        model = ToolModuleGroup


class ToolModuleTypeObject(DjangoObjectType):
    class Meta:
        model = ToolModuleType


class ToolModuleObject(DjangoObjectType):
    class Meta:
        model = ToolModule


class ToolSensorTypeObject(DjangoObjectType):
    class Meta:
        model = ToolSensorType


class ToolInstalledSensorObject(DjangoObjectType):
    class Meta:
        model = ToolInstalledSensor


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "groups",
        )


class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = ("id", "name")


class ParameterTypeObject(DjangoObjectType):
    class Meta:
        model = ParameterType


class ParameterObject(DjangoObjectType):
    class Meta:
        model = Parameter


class ResourceStringObject(DjangoObjectType):
    class Meta:
        model = ResourceString


class UnitObject(DjangoObjectType):
    class Meta:
        model = Unit


class UnitSystemObject(DjangoObjectType):
    class Meta:
        model = UnitSystem


class MeasureObject(DjangoObjectType):
    class Meta:
        model = Measure


class MeasureUnitObject(DjangoObjectType):
    class Meta:
        model = MeasureUnit


class UnitSystemMeasureUnitObject(DjangoObjectType):
    class Meta:
        model = UnitSystemMeasureUnit


class ConversionFactorObject(DjangoObjectType):
    class Meta:
        model = ConversionFactor


class ProfileObject(DjangoObjectType):
    class Meta:
        model = Profile
