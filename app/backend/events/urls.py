from django.urls import path
from .views import EventList, EventDetail, ListingList, ListingDetail

urlpatterns = [
    path('events/', EventList.as_view()),
    path('events/<int:pk>/', EventDetail.as_view()),
    path('ads/', ListingList.as_view()),
    path('ads/<int:pk>/', ListingDetail.as_view()),
    path('listing/', ListingList.as_view()),
    path('listing/<int:pk>/', ListingDetail.as_view()),
]
