import graphene as GraphQL
from graphql import GraphQLError

from django.db.models import Q
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
    user = GraphQL.Field(UserType)  # TODO: ()targetID param
    validateUser = GraphQL.List(GraphQL.Boolean, login = GraphQL.String(), email = GraphQL.String())  # [bool!, bool!]::[login, email]

    # - resolvers - #
    def resolve_users(self, info):
        # info.context.session['f'] = None
        return User.objects.all()
    # end

    def resolve_user(self, info):
        uid = info.context.session.get('userid', None)

        if(uid):  # return user
            # TODO: Check if self id or target
            try:
                user = User.objects.get(id = uid)

                return user
            except:
                info.context.session['userid'] = None  # clear auth data
                raise GraphQLError("Invalid session")
            # end
        else:
            return None
        # end
    # end

    def resolve_validateUser(self, info, email, login):
        result = [False, False]  # allowed login?, allowed email?

        # Check login
        try:
            user = User.objects.get(login = login)

            if(user):
                result[0] = False
        except:
            result[0] = True
        # end

        # Check email
        try:
            user = User.objects.get(email = email)

            if(user):
                result[1] = False
        except:
            result[1] = True
        # end

        return result
    # end
# end

# --- MUTATION --- #
class RegisterMutation(GraphQL.Mutation):

    class Arguments:
        name = GraphQL.String()
        login = GraphQL.String()
        password = GraphQL.String()
        email = GraphQL.String()
    # end

    Output = UserType

    def mutate(self, info, login, password, name, email):
        user = User()
        user.name = name
        user.login = login
        user.password = password
        user.email = email

        user.save()

        info.context.session['userid'] = user.id

        return user
    # end
# end


class LoginMutation(GraphQL.Mutation):

    class Arguments:
        login = GraphQL.String()
        password = GraphQL.String()
    # end

    Output = UserType

    def mutate(self, info, login, password):
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
    registerUser = RegisterMutation.Field()
    loginUser = LoginMutation.Field()
    logout = LogoutMutation.Field()
# end


# --- SCHEMA OUTPUT --- #
schema = GraphQL.Schema(query = RootQuery, mutation = RootMutation)
