import graphene

from api.graphql.mutations.parameter import UpdateParameter
from api.graphql.mutations.profile import UpdateProfile

from api.graphql.mutations.tool_installed_sensor import (
    CreateToolInstalledSensor,
    UpdateToolInstalledSensor,
    DeleteToolInstalledSensor,
)
from api.graphql.mutations.tool_module import (
    CreateToolModule,
    UpdateToolModule,
    DeleteToolModule,
)
from api.graphql.mutations.tool_module_group import (
    CreateToolModuleGroup,
    UpdateToolModuleGroup,
    DeleteToolModuleGroup,
)
from api.graphql.mutations.tool_module_type import (
    CreateToolModuleType,
    UpdateToolModuleType,
    DeleteToolModuleType,
)
from api.graphql.mutations.tool_sensor_type import (
    CreateToolSensorType,
    UpdateToolSensorType,
    DeleteToolSensorType,
)


class Mutation(graphene.ObjectType):
    create_tool_installed_sensor = CreateToolInstalledSensor.Field()
    update_tool_installed_sensor = UpdateToolInstalledSensor.Field()
    delete_tool_installed_sensor = DeleteToolInstalledSensor.Field()

    create_tool_module = CreateToolModule.Field()
    update_tool_module = UpdateToolModule.Field()
    delete_tool_module = DeleteToolModule.Field()

    create_tool_module_group = CreateToolModuleGroup.Field()
    update_tool_module_group = UpdateToolModuleGroup.Field()
    delete_tool_module_group = DeleteToolModuleGroup.Field()

    create_tool_module_type = CreateToolModuleType.Field()
    update_tool_module_type = UpdateToolModuleType.Field()
    delete_tool_module_type = DeleteToolModuleType.Field()

    create_tool_sensor_type = CreateToolSensorType.Field()
    update_tool_sensor_type = UpdateToolSensorType.Field()
    delete_tool_sensor_type = DeleteToolSensorType.Field()

    update_parameter = UpdateParameter.Field()

    update_profile = UpdateProfile.Field()
