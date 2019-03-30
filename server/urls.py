from django.contrib import admin
from django.urls import path, re_path, include
from django.conf.urls.static import static
from . import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api', include('graphapi.urls')),

    path('', include('client.urls')),
    re_path(r'^(?P<path>.*)/', include('client.urls'))
]

# Allow to get media files
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
