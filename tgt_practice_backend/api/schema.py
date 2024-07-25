import graphene

from api.graphql.queries import Query
from api.graphql.mutation import Mutation

schema = graphene.Schema(query=Query, mutation=Mutation)
