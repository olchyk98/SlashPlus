# Generated by Django 2.1.7 on 2019-03-28 15:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphapi', '0007_auto_20190319_2046'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='permission',
            new_name='role',
        ),
    ]
