# Generated by Django 4.2.5 on 2023-10-04 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('universeety', '0002_alter_university_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('level', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'course',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UniversityCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(blank=True, null=True)),
                ('accreditation', models.CharField(blank=True, null=True)),
            ],
            options={
                'db_table': 'university_course',
                'managed': False,
            },
        ),
        migrations.AlterModelTable(
            name='university',
            table='university',
        ),
    ]
