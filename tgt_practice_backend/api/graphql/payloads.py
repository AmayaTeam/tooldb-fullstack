import graphene
from .types import (
    ToolInstalledSensorObject,
    ToolModuleObject,
    ToolModuleGroupObject,
    ToolModuleTypeObject,
    ToolSensorTypeObject,
    ParameterObject,
    ProfileObject,
)


class ToolInstalledSensorPayload(graphene.ObjectType):
    tool_installed_sensor = graphene.Field(ToolInstalledSensorObject)


class ToolModuleGroupPayload(graphene.ObjectType):
    tool_module_group = graphene.Field(ToolModuleGroupObject)


class DeletePayload(graphene.ObjectType):
    success = graphene.Boolean()


class ToolModulePayload(graphene.ObjectType):
    tool_module = graphene.Field(ToolModuleObject)


class ToolModuleTypePayload(graphene.ObjectType):
    tool_module_type = graphene.Field(ToolModuleTypeObject)


class ToolSensorTypePayload(graphene.ObjectType):
    tool_sensor_type = graphene.Field(ToolSensorTypeObject)

class ParameterPayload(graphene.ObjectType):
    parameter = graphene.Field(ParameterObject)

class ProfilePayload(graphene.ObjectType):
    profile = graphene.Field(ProfileObject)


