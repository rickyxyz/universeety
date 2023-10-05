from django.urls import path, include
from rest_framework import routers
from universeety import views
from . import views

router = routers.DefaultRouter()
router.register(r"university", views.UniversityView, "university")
router.register(r"course", views.CourseView, "course")
router.register(r"university_course", views.UniversityCourseView, "university_course")

urlpatterns = [
    path("", include(router.urls)),
    path("search/", views.SearchAPIView.as_view()),
]
