from django.db import models

# Create your models here.

class User(models.Model):
	name = models.CharField(max_length = 200)
	login = models.CharField(max_length = 100)
	password = models.CharField(max_length = 600)
	email = models.CharField(max_length = 300)

	__str__ = lambda self: self.login
# end

class ColorPalette(models.Model):
	creatorID = models.CharField(max_length = 20)
	colors = models.CharField(max_length = 2000) # JSON { colors: ['#*', '#*', '#*'] }

	__str__ = lambda self: self.colors[:10]
# end
