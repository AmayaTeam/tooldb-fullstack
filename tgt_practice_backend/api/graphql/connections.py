import graphene

from .types import (
    ToolModuleGroupObject,
    ToolModuleTypeObject,
    ToolModuleObject,
    ToolSensorTypeObject,
    ToolInstalledSensorObject,
    ResourceStringObject,
    UnitObject,
    UnitSystemObject,
    MeasureObject,
    MeasureUnitObject,
    UnitSystemMeasureUnitObject,
    ConversionFactorObject,
    ProfileObject,
    ParameterTypeObject,
    ParameterObject,
)


class ToolModuleGroupConnection(graphene.relay.Connection):
    class Meta:
        node = ToolModuleGroupObject


class ToolModuleTypeConnection(graphene.relay.Connection):
    class Meta:
        node = ToolModuleTypeObject


class ToolModuleConnection(graphene.relay.Connection):
    class Meta:
        node = ToolModuleObject


class ToolSensorTypeConnection(graphene.relay.Connection):
    class Meta:
        node = ToolSensorTypeObject


class ToolInstalledSensorConnection(graphene.relay.Connection):
    class Meta:
        node = ToolInstalledSensorObject


class UnitConnection(graphene.relay.Connection):
    class Meta:
        node = UnitObject


class UnitSystemConnection(graphene.relay.Connection):
    class Meta:
        node = UnitSystemObject


class MeasureConnection(graphene.relay.Connection):
    class Meta:
        node = MeasureObject


class MeasureUnitConnection(graphene.relay.Connection):
    class Meta:
        node = MeasureUnitObject


class UnitSystemMeasureUnitConnection(graphene.relay.Connection):
    class Meta:
        node = UnitSystemMeasureUnitObject


class ConversionFactorConnection(graphene.relay.Connection):
    class Meta:
        node = ConversionFactorObject


class ProfileConnection(graphene.relay.Connection):
    class Meta:
        node = ProfileObject


class ParameterTypeConnection(graphene.relay.Connection):
    class Meta:
        node = ParameterTypeObject


class ParameterConnection(graphene.relay.Connection):
    class Meta:
        node = ParameterObject


class ResourceStringConnection(graphene.relay.Connection):
    class Meta:
        node = ResourceStringObject
