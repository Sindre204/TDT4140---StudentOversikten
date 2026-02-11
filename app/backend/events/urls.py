from django.urls import path
from .views import EventList, ListingList

urlpatterns = [
    path('events/', EventList.as_view()),
    path('ads/', ListingList.as_view()),
    path('listing/', ListingList.as_view()),
]
