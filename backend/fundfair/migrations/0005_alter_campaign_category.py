# Generated by Django 4.0 on 2024-03-20 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fundfair', '0004_campaign'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='category',
            field=models.IntegerField(),
        ),
    ]
