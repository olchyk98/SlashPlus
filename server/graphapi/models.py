from django.db import models

# Create your models here.

class User(models.Model):
	name = models.CharField(max_length = 200)
	login = models.CharField(max_length = 100)
	password = models.CharField(max_length = 600)
	email = models.CharField(max_length = 300)
	avatar = models.CharField(max_length = 200)

	__str__ = lambda self: self.login
# end

class ColorPalette(models.Model):
	creatorID = models.CharField(max_length = 20)
	colors = models.CharField(max_length = 2000) # JSON { colors: ['#*', '#*', '#*'] }

	__str__ = lambda self: self.colors[:10]
# end

class Color(models.Model):
	creatorID = models.CharField(max_length = 20)
	color = models.CharField(max_length = 20)

	__str__ = lambda self: self.color
# end

class Font(models.Model):
	src = models.CharField(max_length = 900)
	name = models.CharField(max_length = 900)
	creatorID = models.CharField(max_length = 20)
	fontName = models.CharField(max_length = 100)

	__str__ = lambda self: self.name
# end

class Article(models.Model):
	title = models.CharField(max_length = 300)
	contentHTML = models.TextField()
	date = models.DateField(auto_now_add = True)
	creatorID = models.CharField(max_length = 100)

	__str__ = lambda self: self.title
# end
