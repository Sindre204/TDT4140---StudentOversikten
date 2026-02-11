from django.db import models
from django.contrib.auth.models import User


# Represents an event students can attend
class Event(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    description = models.TextField()
    places = models.CharField(max_length=200)
    capacity = models.IntegerField(default=100)
    image = models.ImageField(upload_to='events/', blank=True, null=True)


    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


# Represents a job advertisement or opportunity
class Ad(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    company = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
