from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from events.models import Event


class ExploreEventsTest(APITestCase):
    def setUp(self):

        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="testpass")
        
        # publish events
        self.event1 = Event.objects.create(
            title="Event 1",
            description="Description for Event 1",
            date="2024-07-01",
            places = "Place 1",
            created_by=self.user
        )

        self.event2 = Event.objects.create(
            title = "Event 2",
            description = "Description for Event 2",
            date = "2024-08-01",
            places = "Place 2",
            created_by=self.user
            
            
        )

    
    # Check that only published events are returned in the explore events endpoint
    def test_explore_events_returns_events(self):
        
        response = self.client.get("/api/events/", format="json")


        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        # Check that the returned events are only the published ones
        titles = [event["title"] for event in response.data]
        self.assertIn(self.event1.title, titles)
        self.assertIn(self.event2.title, titles)   

    
    # Check that the explore events endpoint returns an empty list when there are no events
    def test_explore_events_returns_empty_list_when_no_events(self):
        Event.objects.all().delete()  # Delete all events

        response = self.client.get("/api/events/", format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)



    # Check that the event details endpoint returns the correct event details
    def test_event_details_returns_correct_event(self):
        response = self.client.get(f"/api/events/{self.event1.id}/", format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], self.event1.title)
        self.assertEqual(response.data["description"], self.event1.description)
        self.assertEqual(response.data["date"], str(self.event1.date))
        self.assertEqual(response.data["places"], self.event1.places)


    def test_event_details_returns_404_for_nonexistent_event(self):
        response = self.client.get("/api/events/999/", format="json")

        self.assertEqual(response.status_code, 404)
        
