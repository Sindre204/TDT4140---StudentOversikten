from django.contrib.auth.models import Group, User
from rest_framework import status
from rest_framework.test import APITestCase

from events.models import Event, Registration


class EventRegistrationTests(APITestCase):
    def setUp(self):
        company_group, _ = Group.objects.get_or_create(name="company")

        self.user = User.objects.create_user(
            username="testuser",
            password="password123",
            email="testuser@example.com",
        )
        self.company_user = User.objects.create_user(
            username="company@example.com",
            password="password123",
            email="company@example.com",
        )
        self.company_user.groups.add(company_group)
        self.other_company_user = User.objects.create_user(
            username="other-company@example.com",
            password="password123",
            email="other-company@example.com",
        )
        self.other_company_user.groups.add(company_group)
        self.event = Event.objects.create(
            title="Test Event",
            category="Sosialt",
            date="2026-05-01",
            description="Event description",
            places="Oslo",
            created_by=self.company_user,
        )

    def test_user_can_register_for_event(self):
        url = f"/api/events/{self.event.id}/register/"
        response = self.client.post(url, {"user_id": self.user.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Registration.objects.filter(user=self.user, event=self.event).exists())

    def test_user_cannot_register_twice(self):
        url = f"/api/events/{self.event.id}/register/"
        self.client.post(url, {"user_id": self.user.id}, format="json")
        response = self.client.post(url, {"user_id": self.user.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_non_existing_event(self):
        url = "/api/events/9999/register/"
        response = self.client.post(url, {"user_id": self.user.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_missing_user_id_returns_400(self):
        url = f"/api/events/{self.event.id}/register/"
        response = self.client.post(url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_can_read_registration_status(self):
        Registration.objects.create(user=self.user, event=self.event)
        url = f"/api/events/{self.event.id}/register/?user_id={self.user.id}"
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_registered"])
        self.assertEqual(response.data["registrations_count"], 1)

    def test_user_can_unregister(self):
        Registration.objects.create(user=self.user, event=self.event)
        url = f"/api/events/{self.event.id}/register/?user_id={self.user.id}"
        response = self.client.delete(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Registration.objects.filter(user=self.user, event=self.event).exists())

    def test_owner_company_can_view_event_registrations(self):
        Registration.objects.create(user=self.user, event=self.event)
        url = f"/api/events/{self.event.id}/registrations/?company_user_id={self.company_user.id}"
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["registrations_count"], 1)
        self.assertEqual(response.data["participants"][0]["id"], self.user.id)

    def test_other_company_cannot_view_event_registrations(self):
        url = f"/api/events/{self.event.id}/registrations/?company_user_id={self.other_company_user.id}"
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_view_event_registrations(self):
        url = f"/api/events/{self.event.id}/registrations/?company_user_id={self.user.id}"
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_company_user_cannot_register_for_event(self):
        url = f"/api/events/{self.event.id}/register/"
        response = self.client.post(url, {"user_id": self.company_user.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
