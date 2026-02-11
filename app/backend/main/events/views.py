from rest_framework import generics
from .models import Event, Ad
from .serializers import EventSerializer, AdSerializer

# API/Controller-layer

class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class AdList(generics.ListAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer



