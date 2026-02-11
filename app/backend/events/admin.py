from django.contrib import admin
from .models import Event, Listing

# Register models in Django admin panel
admin.site.register(Event)
admin.site.register(Listing)
