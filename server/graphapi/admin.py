from django.contrib import admin

from .models import User, ColorPalette

# Register your models here.

admin.site.register(User)
admin.site.register(ColorPalette)
