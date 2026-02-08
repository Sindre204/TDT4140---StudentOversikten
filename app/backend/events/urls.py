from django.urls import path
from .views import EventList, AdList

urlpatterns = [
    path('events/', EventList.as_view()),
    path('ads/', AdList.as_view()),
]
