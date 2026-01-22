from django.urls import path
from . import views

urlpatterns = [
    path('api/upload-excel/', views.upload_excel, name='upload_excel'),
]