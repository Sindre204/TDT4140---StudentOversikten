from django.db import models
from django.contrib.auth.models import User


# Constants
EVENT_CATEGORIES = [
    ('Sosialt', 'Sosialt'),
    ('Karriere', 'Karriere'),
    ('Workshop', 'Workshop'),
    ('Sport', 'Sport'),
    ('Faglig', 'Faglig'),
    ('Fest', 'Fest'),
    ('Nettverksbygging', 'Nettverksbygging'),
    ('Annet', 'Annet'),
]


# Represents an event students can attend
class Event(models.Model):

    title = models.CharField(max_length=200)

    category = models.CharField(
        max_length=50,
        choices=EVENT_CATEGORIES
    )

    date = models.DateField()
    description = models.TextField()
    places = models.CharField(max_length=200)
    capacity = models.IntegerField(default=100)

    image = models.ImageField(upload_to='events/', blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


# Represents a job advertisement or opportunity
class Listing(models.Model):

    EMPLOYMENT_TYPES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Internship', 'Internship'),
        ('Summer job', 'Summer job'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    company = models.CharField(max_length=200)

    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPES
    )

    city = models.CharField(
        max_length=100
    )

    image = models.ImageField(upload_to='events/', blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)


    def save(self, *args, **kwargs):
        if self.city:
            self.city = self.city.strip().title()
        super().save(*args, **kwargs)


    def __str__(self):
        return self.title
