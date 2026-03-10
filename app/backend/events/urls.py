from django.urls import path
from .views import (
    EventList,
    EventDetail,
    ListingList,
    ListingDetail,
    CompanyList,
    CompanyDetail,
    EventRegistrationView,
    EventParticipantsView,
    EventRegistrationsForCompanyView,
    RegisterView,
    LoginView,
)

urlpatterns = [
    path('events/', EventList.as_view()),
    path('events/<int:pk>/', EventDetail.as_view()),
    path('events/<int:pk>/register/', EventRegistrationView.as_view()),
    path('events/<int:pk>/participants/', EventParticipantsView.as_view()),
    path('events/<int:pk>/registrations/', EventRegistrationsForCompanyView.as_view()),
    path('ads/', ListingList.as_view()),
    path('ads/<int:pk>/', ListingDetail.as_view()),
    path('listing/', ListingList.as_view()),
    path('listing/<int:pk>/', ListingDetail.as_view()),
    path('companies/', CompanyList.as_view()),
    path('companies/<int:pk>/', CompanyDetail.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
]
