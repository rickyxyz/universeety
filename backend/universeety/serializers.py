from rest_framework import serializers
from .models import University, Course, UniversityCourse


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = (
            "id",
            "code",
            "name",
            "abbreviation",
            "accreditation",
            "program_count",
            "website",
            "phone",
            "address1",
            "address2",
            "latitude",
            "longitude",
        )


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            "id",
            "code",
            "name",
            "level",
        )


class UniversityCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityCourse
        fields = (
            "id",
            "course_code",
            "university_code",
        )
