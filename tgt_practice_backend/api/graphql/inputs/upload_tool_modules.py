import graphene

from api.graphql.inputs.tool_module import CreateToolModuleInput
from api.graphql.inputs.tool_module_group import CreateToolModuleGroupInput
from api.graphql.inputs.tool_module_type import CreateToolModuleTypeInput
from api.graphql.inputs.parameter import CreateParameterInput


class UploadToolModuleInput(graphene.InputObjectType):
    # Input fields for new ToolModules
    # new_module_list = graphene.List(
    #     graphene.NonNull(CreateToolModuleInput),
    #     description="List of new ToolModules to be created."
    # )
    #
    # # Input fields for modified ToolModules
    # modified_module_list = graphene.List(
    #     graphene.NonNull(CreateToolModuleInput),
    #     description="List of existing ToolModules to be updated."
    # )
    #
    # # Input fields for new Parameters
    # new_parameters = graphene.List(
    #     graphene.NonNull(CreateParameterInput),
    #     description="List of new Parameters to be created."
    # )
    #
    # # Input fields for modified Parameters
    # modified_parameters = graphene.List(
    #     graphene.NonNull(CreateParameterInput),
    #     description="List of existing Parameters to be updated."
    # )
    #
    # # Input fields for new ToolModuleGroups
    # new_group_list = graphene.List(
    #     graphene.NonNull(CreateToolModuleGroupInput),
    #     description="List of new ToolModuleGroups to be created."
    # )
    #
    # # Input fields for new ToolModuleTypes
    # new_module_type_list = graphene.List(
    #     graphene.NonNull(CreateToolModuleTypeInput),
    #     description="List of new ToolModuleTypes to be created."
    # )
    data = graphene.String()