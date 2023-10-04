from rest_framework import viewsets
from .serializers import (
    UniversitySerializer,
    CourseSerializer,
    UniversityCourseSerializer,
)
from .models import University, Course, UniversityCourse


class UniversityView(viewsets.ModelViewSet):
    serializer_class = UniversitySerializer
    queryset = University.objects.all()


class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class UniversityCourseView(viewsets.ModelViewSet):
    serializer_class = UniversityCourseSerializer
    queryset = UniversityCourse.objects.all()
