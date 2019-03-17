from django.db import models

# Create your models here.

class User(models.Model):
	name = models.CharField(max_length = 200)
	login = models.CharField(max_length = 100)
	password = models.CharField(max_length = 600)
	email = models.CharField(max_length = 300)

	__str__ = lambda self: self.login
# end