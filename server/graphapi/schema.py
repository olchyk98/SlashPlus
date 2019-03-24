import graphene as GraphQL
from graphql import GraphQLError
from graphene_django.types import DjangoObjectType
from graphene_file_upload.scalars import Upload

from django.db.models import Q
import json
import re
import string
from random import randint
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from django.conf import settings
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
class RootMutation(GraphQL.ObjectType):
    class RegisterMutation(GraphQL.Mutation):
        class Arguments:
            name = GraphQL.NonNull(GraphQL.String)
            login = GraphQL.NonNull(GraphQL.String)
            password = GraphQL.NonNull(GraphQL.String)
            email = GraphQL.NonNull(GraphQL.String)
        # end

        Output = UserType

        def mutate(self, info, login, password, name, email):
            user = User(
                name = name,
                login = login,
                password = password,
                email = email,
                avatar = '/media/avatars/default.svg'
            )
            user.save()

            info.context.session['userid'] = user.id
            return user
        # end
    # end


    class LoginMutation(GraphQL.Mutation):
        class Arguments:
            login = GraphQL.NonNull(GraphQL.String)
            password = GraphQL.NonNull(GraphQL.String)
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

    class AddColorMutation(GraphQL.Mutation):
        class Arguments:
            color = GraphQL.NonNull(GraphQL.String)
        # end

        Output = ColorType

        def mutate(self, info, color):
            cid = info.context.session.get('userid', None)

            if(not cid): return None

            # Check if color is already in the database
            try:
                _color = Color.objects.get(color = color) # Casts an error if color wasn't found
                return None
            except:
                _color = Color(color = color, creatorID = cid)
                _color.save()

                return _color
            # end
        # end
    # end

    class AddPaletteMutation(GraphQL.Mutation):
        class Arguments:
            colors = GraphQL.NonNull(GraphQL.List(GraphQL.String))
        # end

        Output = ColorPaletteType

        def mutate(self, info, colors):
            cid = info.context.session.get('userid', None)

            if(not cid): return None

            palette = ColorPalette(colors = json.dumps(colors)) # WARNING: 'colors' -=> JSON (str)
            palette.save()

            return palette
        # end
    # end

    class AddFontMutation(GraphQL.Mutation):
        class Arguments:
            file = GraphQL.NonNull(Upload)
            name = GraphQL.NonNull(GraphQL.String)
            execName = GraphQL.NonNull(GraphQL.String)
        # end

        Output = FontType

        def mutate(self, info, file, execName, name):
            uid = info.context.session.get('userid', None)

            if(uid):
                io = Font.objects.filter( Q(fontName = execName) | Q(name = name) )
                if(len(io)): return None

                def randName(length = 35):
                    a = ""
                    b = list(string.ascii_lowercase + string.ascii_uppercase + string.digits)

                    for ma in range(length):
                        a += b[ randint(0, len(b) - 1) ]
                    # end

                    return a
                # end

                ext = re.findall(r'[^\\]*\.(\w+)$', file.name)[0] # get file extension
                # saves to the media folder
                path = settings.MEDIA_URL + default_storage.save('fonts/%s_%s_%s_%s.%s' % (uid, execName, name, randName(75), ext), ContentFile(file.read()))

                font = Font(
                    src = path,
                    name = name,
                    creatorID = uid,
                    fontName = execName,
                    placeStatus = "WAITING"
                )
                font.save()

                return font
            else:
                raise GraphQLError("Invalid session")
            # end
        # end
    # end

    registerUser = RegisterMutation.Field()
    loginUser = LoginMutation.Field()
    logout = LogoutMutation.Field()
    addColor = AddColorMutation.Field()
    addPalette = AddPaletteMutation.Field()
    addFont = AddFontMutation.Field()
# end


# --- SCHEMA OUTPUT --- #
schema = GraphQL.Schema(query = RootQuery, mutation = RootMutation)
