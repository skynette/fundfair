# Generated by Django 4.0 on 2024-03-20 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fundfair', '0006_alter_emailverification_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='deadline',
            field=models.CharField(max_length=255),
        ),
    ]
