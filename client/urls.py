from django.urls import path

from .views import RootView

urlpatterns = [
    path('', RootView.as_view())
]
