from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthApiTests(APITestCase):
    register_url = "/api/auth/register/"
    login_url = "/api/auth/login/"

    def test_register_creates_user_and_returns_public_payload(self):
        payload = {
            "email": "student@example.com",
            "fullName": "Student User",
            "password": "Password123",
        }

        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], payload["email"])
        self.assertEqual(response.data["fullName"], payload["fullName"])
        self.assertEqual(response.data["role"], "student")
        self.assertNotIn("password", response.data)

        created_user = User.objects.get(email=payload["email"])
        self.assertEqual(created_user.username, payload["email"])
        self.assertTrue(created_user.check_password(payload["password"]))

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="Password123",
        )
        payload = {
            "email": "student@example.com",
            "fullName": "Another User",
            "password": "Password123",
        }

        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login_returns_user_payload_for_valid_credentials(self):
        user = User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            first_name="Student User",
            password="Password123",
        )

        response = self.client.post(
            self.login_url,
            {"email": "student@example.com", "password": "Password123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], user.id)
        self.assertEqual(response.data["email"], "student@example.com")
        self.assertEqual(response.data["fullName"], "Student User")
        self.assertEqual(response.data["role"], "student")
        self.assertNotIn("password", response.data)

    def test_login_rejects_invalid_password(self):
        User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="Password123",
        )

        response = self.client.post(
            self.login_url,
            {"email": "student@example.com", "password": "WrongPassword"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_rejects_inactive_user(self):
        user = User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="Password123",
        )
        user.is_active = False
        user.save(update_fields=["is_active"])

        response = self.client.post(
            self.login_url,
            {"email": "student@example.com", "password": "Password123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_returns_admin_role_for_staff_or_superuser(self):
        User.objects.create_user(
            username="admin@example.com",
            email="admin@example.com",
            first_name="Admin User",
            password="Password123",
            is_staff=True,
        )

        response = self.client.post(
            self.login_url,
            {"email": "admin@example.com", "password": "Password123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], "admin")
