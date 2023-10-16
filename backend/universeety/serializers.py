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


class SearchSerializer(serializers.ModelSerializer):
    match_type = serializers.SerializerMethodField()

    class Meta:
        model = University
        fields = "__all__"

    def get_match_type(self, obj):
        request = self.context.get("request")
        if request is not None:
            query = request.GET.get("q", "").lower()
            if obj.name.lower().find(query) != -1:
                return "name"
            elif (
                obj.address1.lower().find(query) != -1
                or obj.address2.lower().find(query) != -1
            ):
                return "address"
            elif obj.universitycourse_set.filter(
                course_code__name__icontains=query
            ).exists():
                return "course"
            else:
                return ""
        return ""
