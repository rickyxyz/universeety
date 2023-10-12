from django.db.models import Q
from rest_framework import status, viewsets, views
from rest_framework.response import Response
from .models import University, Course, UniversityCourse
from .serializers import (
    SearchSerializer,
    UniversitySerializer,
    CourseSerializer,
    UniversityCourseSerializer,
)


class UniversityView(viewsets.ModelViewSet):
    serializer_class = UniversitySerializer
    queryset = University.objects.all()


class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class UniversityCourseView(viewsets.ModelViewSet):
    serializer_class = UniversityCourseSerializer
    queryset = UniversityCourse.objects.all()


class SearchAPIView(views.APIView):
    def get(self, request, format=None):
        query = request.GET.get("q", "")
        if not query:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        universities = University.objects.filter(
            Q(name__icontains=query)
            | Q(address1__icontains=query)
            | Q(address2__icontains=query)
            | Q(universitycourse__course_code__name__icontains=query)
        ).distinct()

        serializer = SearchSerializer(
            universities, many=True, context={"request": request}
        )
        return Response(serializer.data)
