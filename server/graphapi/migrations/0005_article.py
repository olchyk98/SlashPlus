# Generated by Django 2.1.7 on 2019-03-18 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graphapi', '0004_font_fontname'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('contentHTML', models.TextField()),
                ('date', models.DateField(auto_now_add=True)),
                ('creatorID', models.CharField(max_length=100)),
            ],
        ),
    ]
