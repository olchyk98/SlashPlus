from django.urls import path
from graphene_django.views import GraphQLView
from .schema import schema

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
	path('', csrf_exempt(GraphQLView.as_view(
		graphiql = settings.DEBUG,
		schema = schema
	)))
]