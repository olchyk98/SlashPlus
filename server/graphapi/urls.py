from django.urls import path
from graphene_django.views import GraphQLView
from .schema import schema

from django.conf import settings

urlpatterns = [
	path('', GraphQLView.as_view(
		graphiql = settings.DEBUG,
		schema = schema
	))
]