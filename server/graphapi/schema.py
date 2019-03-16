import graphene as GraphQL
from graphene_django.types import DjangoObjectType
from .models import User

# --- TYPES ---
class UserType(DjangoObjectType):
    class Meta:
        model = User
    # end
# end

# --- QUERY ---
class RootQuery(GraphQL.ObjectType):
    users = GraphQL.List(UserType)

    # - resolvers -
    def resolve_users(self, info):
    	print(info.context.session.aql)
    	info.context.session.aql = 4
    	return User.objects.all()
    # end
# end

# --- MUTATION ---

# --- SCHEMA OUTPUT ---
schema = GraphQL.Schema(query = RootQuery)