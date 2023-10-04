from django.contrib import admin
from .models import University, Course, UniversityCourse


class UniversityAdmin(admin.ModelAdmin):
    ordering = ("id",)
    list_display = ("id", "code", "name")


class CourseAdmin(admin.ModelAdmin):
    ordering = ("id",)
    list_display = ("id", "code", "name")


class UniversityCourseAdmin(admin.ModelAdmin):
    ordering = ("id",)
    list_display = ("id", "get_course_name", "get_university_name")

    def get_course_name(self, obj):
        return obj.course_code.name

    def get_university_name(self, obj):
        return obj.university_code.name


admin.site.register(University, UniversityAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(UniversityCourse, UniversityCourseAdmin)
