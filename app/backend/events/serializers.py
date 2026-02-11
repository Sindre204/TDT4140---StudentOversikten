from rest_framework import serializers
from .models import Event, Listing

#Translates between DB-objekt and JSON

class EventSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Event
        fields = '__all__'


class ListingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Listing
        fields = '__all__'
