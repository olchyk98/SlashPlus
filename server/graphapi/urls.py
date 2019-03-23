from django.urls import path
from graphene_django.views import GraphQLView
from .schema import schema

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from graphene_file_upload.django import FileUploadGraphQLView

urlpatterns = [
	path('', csrf_exempt(FileUploadGraphQLView.as_view(
		graphiql = settings.DEBUG,
		schema = schema
	)))
]
