from django.db import models


class University(models.Model):
    code = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=255)
    abbreviation = models.CharField(max_length=255)
    accreditation = models.CharField(max_length=255)
    program_count = models.IntegerField()
    website = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "university"
        verbose_name_plural = "universities"


class Course(models.Model):
    code = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = "course"


class UniversityCourse(models.Model):
    course_code = models.ForeignKey(
        "Course",
        models.DO_NOTHING,
        db_column="course_code",
        to_field="code",
        blank=True,
        null=True,
    )
    university_code = models.ForeignKey(
        "University",
        models.DO_NOTHING,
        db_column="university_code",
        to_field="code",
        blank=True,
        null=True,
    )
    status = models.CharField(blank=True, null=True)
    accreditation = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "university_course"
        unique_together = (("university_code", "course_code"),)
