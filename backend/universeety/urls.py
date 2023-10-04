from django.urls import path, include
from rest_framework import routers
from universeety import views
from . import views

router = routers.DefaultRouter()
router.register(r"university", views.UniversityView, "university")

urlpatterns = [path("api/", include(router.urls))]
