from django.contrib import admin
from .models import Event, Ad

# Register models in Django admin panel
admin.site.register(Event)
admin.site.register(Ad)
