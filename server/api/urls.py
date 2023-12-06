from django.urls import path
from .views import batch_check_images, check_image, report

urlpatterns = [
    # API Endpoints
    path("api/check/", check_image),
    path("api/report/", report),
    path("api/batch_check/", batch_check_images)
]
