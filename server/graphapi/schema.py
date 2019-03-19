import graphene as GraphQL
from graphql import GraphQLError
from graphene_django.types import DjangoObjectType

from django.db.models import Q
import json
import re

from .models import User, ColorPalette, Color, Font, Article

# --- SAME RESOLVERS --- #
def model_creator_resolver(self, info):
    try:
        return User.objects.get(id = self.creatorID)
    except:
        return None
    # end
# end


# --- TYPES --- #
class UserType(DjangoObjectType):
    class Meta:
        model = User
    # end

    def findObjects(Model, count = False):
        def resolve(self, info):
            if(not count):
                return Model.objects.filter(creatorID = self.id)
            else:
                return Model.objects.filter(creatorID = self.id).count()
            # end
        # end

        return resolve
    # end

    palettes = GraphQL.List(lambda: ColorPaletteType, resolver = findObjects(ColorPalette, False))
    palettesInt = GraphQL.Int(resolver = findObjects(ColorPalette, True))
    colors = GraphQL.List(lambda: ColorType, resolver = findObjects(Color, False))
    colorsInt = GraphQL.Int(resolver = findObjects(Color, True))
    fonts = GraphQL.List(lambda: FontType, resolver = findObjects(Font, False))
    fontsInt = GraphQL.Int(resolver = findObjects(Font, True))
    articles = GraphQL.List(lambda: ArticleType, resolver = findObjects(Article, False))
    articlesInt = GraphQL.Int(resolver = findObjects(Article, True))
    articlesAcceptedInt = GraphQL.Int()

    def resolve_articlesAcceptedInt(self, info):
        return Article.objects.filter(creatorID = self.id, placeStatus = "ACCEPTED").count()
    # end
# end

class ColorPaletteType(DjangoObjectType):
    class Meta:
        model = ColorPalette
    # end

    creator = GraphQL.Field(lambda: UserType, resolver = model_creator_resolver)
    colors = GraphQL.List(GraphQL.String)

    def resolve_colors(self, info):
        return json.loads(self.colors)
    # end
# end

class ColorType(DjangoObjectType):
    class Meta:
        model = Color
    # end

    creator = GraphQL.Field(lambda: UserType, resolver = model_creator_resolver)
# end

class FontType(DjangoObjectType):
    class Meta:
        model = Font
    # end

    creator = GraphQL.Field(lambda: UserType, resolver = model_creator_resolver)
# end

class ArticleType(DjangoObjectType):
    class Meta:
        model = Article
    # end

    creator = GraphQL.Field(lambda: UserType, resolver = model_creator_resolver)
    previewContent = GraphQL.String()

    def resolve_previewContent(self, info):
        limit = 300
        content = re.sub('<[^>]*>', "", self.contentHTML)

        if(len(content) > limit):
            result = content[:limit]

            # check if last symbol is not . or space
            if(result[-1] not in [' ', '.']):
                return result + "..."
            else:
                return result
            # end
        else:
            return content
        # end
    # end
# end

# --- QUERY --- #
class RootQuery(GraphQL.ObjectType):
    users = GraphQL.List(UserType)
    user = GraphQL.Field(UserType, targetLogin = GraphQL.String())
    validateUser = GraphQL.List(GraphQL.Boolean, login = GraphQL.String(), email = GraphQL.NonNull(GraphQL.String))  # [bool!, bool!]::[login, email]
    getColorPalletes = GraphQL.List(ColorPaletteType, limit = GraphQL.NonNull(GraphQL.Int))
    getColors = GraphQL.List(ColorType, limit = GraphQL.NonNull(GraphQL.Int))
    getFonts = GraphQL.List(FontType, limit = GraphQL.NonNull(GraphQL.Int))
    getArticles = GraphQL.List(ArticleType, limit = GraphQL.NonNull(GraphQL.Int))

    # - resolvers - #
    def resolve_users(self, info):
        # info.context.session['f'] = None
        return User.objects.all()
    # end

    def resolve_user(self, info, targetLogin = None):
        uid = info.context.session.get('userid', None)

        if(targetLogin):
            try:
                user = User.objects.get(login = targetLogin)
                return user
            except:
                return None
            # end
        elif(uid): # server own
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

    def resolve_getColorPalletes(self, info, limit): # Get %LIMIT% random palettes
        return ColorPalette.objects.all().order_by('?')[:limit]
    # end

    def resolve_getColors(self, info, limit):
        return Color.objects.all().order_by('?')[:limit]
    # end

    def resolve_getFonts(self, info, limit):
        return Font.objects.filter(placeStatus = "ACCEPTED").order_by('?')[:limit]
    # end

    def resolve_getArticles(self, info, limit):
        return Article.objects.filter(placeStatus = "ACCEPTED").order_by('?')[:limit]
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
        user.avatar = '/media/avatars/default.svg'

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
