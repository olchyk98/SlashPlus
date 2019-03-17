import graphene as GraphQL
from graphql import GraphQLError

from graphene_django.types import DjangoObjectType
from .models import User

# --- TYPES --- #
class UserType(DjangoObjectType):
    class Meta:
        model = User
    # end
# end

# --- QUERY --- #
class RootQuery(GraphQL.ObjectType):
    users = GraphQL.List(UserType)
    user = GraphQL.Field(UserType) # TODO: ()targetID param

    resolve_stac: lambda self, info: "Hello"

    # - resolvers -
    def resolve_users(self, info):
    	# info.context.session['f'] = None
    	return User.objects.all()
    # end

    def resolve_user(self, info):
    	uid = info.context.session.get('userid', None)

    	if(uid): # return user
    		# TODO: Check if self id or target
    		try:
    			user = User.objects.get(id = uid)

    			return user
    		except:
    			info.context.session['userid'] = None # clear auth data
    			raise GraphQLError("Invalid session")
    		# end
    	else:
    		return None
    	# end
    # end
# end

# --- MUTATION --- #
class LoginMutation(GraphQL.Mutation):
	class Arguments:
		login = GraphQL.String()
		password = GraphQL.String()
	# end

	Output = UserType

	def mutate(self, info, login, password):
		# user = User()
		# user.name = ""
		# user.login = login
		# user.password = password
		try:
			user = User.objects.get(login = login, password = password)
			info.context.session['userid'] = user.id

			return user
		except:
			return None
		# end
	# end
# end

class LogoutMutation(GraphQL.Mutation):
	Output = UserType

	def mutate(self, info):
		id = info.context.session.get('userid', None)

		if(id):
			try:
				user = User.objects.get(id = id)
				info.context.session['userid'] = None

				return user
			except:
				info.context.session['userid'] = None

				return None
			# end
		else:
			return None
		# end
	# end
# end

class RootMutation(GraphQL.ObjectType):
	loginUser = LoginMutation.Field()
	logout = LogoutMutation.Field()
# end


# --- SCHEMA OUTPUT --- #
schema = GraphQL.Schema(query = RootQuery, mutation = RootMutation)