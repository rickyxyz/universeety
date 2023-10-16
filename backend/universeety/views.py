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

        name_match_count = 0
        address_match_count = 0
        course_match_count = 0
        universities_with_extra_field = []

        for university in universities:
            if university.name.lower().find(query.lower()) != -1:
                name_match_count += 1
            elif (
                university.address1.lower().find(query.lower()) != -1
                or university.address2.lower().find(query.lower()) != -1
            ):
                address_match_count += 1
            else:
                course_match_count += 1

            universities_with_extra_field.append(university)

        serializer = SearchSerializer(
            universities_with_extra_field, many=True, context={"request": request}
        )

        response_data = {
            "name_match": name_match_count,
            "address_match": address_match_count,
            "course_match": course_match_count,
            "universities": serializer.data,
        }

        return Response(response_data)
