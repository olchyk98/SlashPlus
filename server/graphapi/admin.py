from django.contrib import admin

from .models import User, ColorPalette, Color, Font, Article

# Register your models here.

admin.site.register(User)
admin.site.register(ColorPalette)
admin.site.register(Font)
admin.site.register(Article)
