from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from events.models import Event, Registration


class EventRegistrationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="password123"
        )

        self.event = Event.objects.create(
            title="Test Event",
            date="2026-05-01T12:00:00Z"
        )

    def test_user_can_register_for_event(self):
        self.client.login(username="testuser", password="password123")

        url = f"/api/events/{self.event.id}/register/"
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Registration.objects.filter(
                user=self.user,
                event=self.event
            ).exists()
        )

    def test_user_cannot_register_twice(self):
        self.client.login(username="testuser", password="password123")

        url = f"/api/events/{self.event.id}/register/"

        self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_user_cannot_register(self):
        url = f"/api/events/{self.event.id}/register/"
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_non_existing_event(self):
        self.client.login(username="testuser", password="password123")

        url = "/api/events/9999/register/"
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)