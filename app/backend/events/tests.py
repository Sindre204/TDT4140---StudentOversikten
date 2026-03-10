from django.contrib.auth.models import Group, User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Event, Listing


class CreateContentApiTests(APITestCase):
    def setUp(self):
        self.company_group, _ = Group.objects.get_or_create(name="company")
        self.user = User.objects.create_user(
            username="company@example.com",
            email="company@example.com",
            password="password123",
        )
        self.user.groups.add(self.company_group)
        self.student_user = User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="password123",
        )

    def test_create_event_persists_to_database(self):
        payload = {
            "title": "Karrierekveld",
            "category": "Karriere",
            "date": "2026-04-10",
            "description": "Mote med bedrifter og studenter.",
            "places": "Trondheim",
            "capacity": 120,
            "created_by": self.user.id,
        }

        response = self.client.post("/api/events/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Event.objects.filter(title="Karrierekveld").exists())

        event = Event.objects.get(title="Karrierekveld")
        self.assertEqual(event.created_by, self.user)
        self.assertEqual(event.capacity, 120)

    def test_create_listing_persists_to_database(self):
        payload = {
            "title": "Utvikler Intern",
            "description": "Sommerjobb for utviklere.",
            "company": "Example AS",
            "employment_type": "Internship",
            "city": "oslo",
            "created_by": self.user.id,
        }

        response = self.client.post("/api/ads/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Listing.objects.filter(title="Utvikler Intern").exists())

        listing = Listing.objects.get(title="Utvikler Intern")
        self.assertEqual(listing.created_by, self.user)
        self.assertEqual(listing.city, "Oslo")

    def test_event_list_can_be_filtered_by_creator(self):
        other_user = User.objects.create_user(
            username="other@example.com",
            email="other@example.com",
            password="password123",
        )
        other_user.groups.add(self.company_group)

        Event.objects.create(
            title="Min samling",
            category="Sosialt",
            date="2026-04-11",
            description="Opprettet av innlogget bruker.",
            places="Oslo",
            capacity=40,
            created_by=self.user,
        )
        Event.objects.create(
            title="Annen samling",
            category="Sosialt",
            date="2026-04-12",
            description="Opprettet av en annen bruker.",
            places="Bergen",
            capacity=50,
            created_by=other_user,
        )

        response = self.client.get(f"/api/events/?created_by={self.user.id}", format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Min samling")

    def test_event_list_returns_host_company_name(self):
        self.user.first_name = "Example AS"
        self.user.save(update_fields=["first_name"])

        Event.objects.create(
            title="Karrieredag",
            category="Karriere",
            date="2026-04-11",
            description="Møt bedriften.",
            places="Oslo",
            capacity=40,
            created_by=self.user,
        )

        response = self.client.get("/api/events/", format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["host_company"], "Example AS")

    def test_event_can_be_updated(self):
        event = Event.objects.create(
            title="Fagkveld",
            category="Faglig",
            date="2026-05-01",
            description="Original beskrivelse.",
            places="Trondheim",
            capacity=90,
            created_by=self.user,
        )

        response = self.client.patch(
            f"/api/events/{event.id}/",
            {
                "title": "Oppdatert fagkveld",
                "capacity": 150,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event.refresh_from_db()
        self.assertEqual(event.title, "Oppdatert fagkveld")
        self.assertEqual(event.capacity, 150)

    def test_student_user_cannot_create_event(self):
        payload = {
            "title": "Ulovlig arrangement",
            "category": "Karriere",
            "date": "2026-04-10",
            "description": "Skal avvises.",
            "places": "Trondheim",
            "capacity": 120,
            "created_by": self.student_user.id,
        }

        response = self.client.post("/api/events/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Event.objects.filter(title="Ulovlig arrangement").exists())

    def test_student_created_event_cannot_be_updated(self):
        event = Event.objects.create(
            title="Studentarrangement",
            category="Faglig",
            date="2026-05-01",
            description="Original beskrivelse.",
            places="Trondheim",
            capacity=90,
            created_by=self.student_user,
        )

        response = self.client.patch(
            f"/api/events/{event.id}/",
            {
                "title": "Ny tittel",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        event.refresh_from_db()
        self.assertEqual(event.title, "Studentarrangement")

    def test_listing_can_be_updated(self):
        listing = Listing.objects.create(
            title="Backend-utvikler",
            description="Original tekst.",
            company="Example AS",
            employment_type="Full-time",
            city="trondheim",
            created_by=self.user,
        )

        response = self.client.patch(
            f"/api/ads/{listing.id}/",
            {
                "city": "oslo",
                "description": "Oppdatert tekst.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        listing.refresh_from_db()
        self.assertEqual(listing.city, "Oslo")
        self.assertEqual(listing.description, "Oppdatert tekst.")

    def test_student_user_cannot_create_listing(self):
        payload = {
            "title": "Ulovlig annonse",
            "description": "Skal avvises.",
            "company": "Example AS",
            "employment_type": "Internship",
            "city": "oslo",
            "created_by": self.student_user.id,
        }

        response = self.client.post("/api/ads/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Listing.objects.filter(title="Ulovlig annonse").exists())
