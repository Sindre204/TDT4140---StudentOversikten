from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from events.models import Listing

class ExploreListingsTest(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="testpass")

        # Create test listings
        self.listing1 = Listing.objects.create(
            title="Listing 1",
            description="Description for Listing 1",
            company="Company 1",
            employment_type="Full-time",
            location="Location 1",
            created_by=self.user
        )

        self.listing2 = Listing.objects.create(
            title="Listing 2",
            description="Description for Listing 2",
            company="Company 2",
            employment_type="Part-time",
            location="Location 2",
            created_by=self.user
        )

    def test_explore_listings_returns_listings(self):
        response = self.client.get("/api/ads/", format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        # Check that the returned listings are only the published ones
        titles = [listing["title"] for listing in response.data]
        self.assertIn(self.listing1.title, titles)
        self.assertIn(self.listing2.title, titles)

        first_listing = response.data[0]
        self.assertEqual(first_listing["title"], self.listing1.title)
        self.assertEqual(first_listing["description"], self.listing1.description)
        self.assertEqual(first_listing["company"], self.listing1.company)
        self.assertEqual(first_listing["employment_type"], self.listing1.employment_type)
        self.assertEqual(first_listing["location"], self.listing1.location)

    
    def test_listing_details_returns_correct_listing(self):
        response = self.client.get(f"/api/ads/{self.listing1.id}/", format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], self.listing1.title)
        self.assertEqual(response.data["description"], self.listing1.description)
        self.assertEqual(response.data["company"], self.listing1.company)
        self.assertEqual(response.data["employment_type"], self.listing1.employment_type)
        self.assertEqual(response.data["location"], self.listing1.location)


    def test_listing_details_returns_404_for_nonexistent_listing(self):
        response = self.client.get("/api/ads/999/", format="json")

        self.assertEqual(response.status_code, 404)
        

    def test_explore_listings_returns_empty_list_when_no_listings(self):
        Listing.objects.all().delete()  # Delete all listings

        response = self.client.get("/api/ads/", format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
        