from django.urls import path
from .views import check_image, report

urlpatterns = [
    # API Endpoints
    path("api/check/", check_image),
    path("api/report/", report)
]
