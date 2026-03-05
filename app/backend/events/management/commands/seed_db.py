import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker
from events.models import Event, Listing, Company

# Initialiser Faker
fake = Faker(['no_NO'])


# Generert med Gemini av Henrik C Kran 3.3.2025

class Command(BaseCommand):
    help = 'Fyller databasen med DETERMINISTISKE testdata (likt hver gang)'

    def handle(self, *args, **kwargs):
        # --- SEEDING ---
        # Ved å sette dette tallet, vil random.choice og fake.name() 
        # alltid returnere det samme resultatet hver gang scriptet kjøres.
        SEED = 42
        random.seed(SEED)
        Faker.seed(SEED)
        
        # 1. Hent en bruker til å eie dataene
        user = User.objects.first()
        if not user:
            self.stdout.write("Ingen bruker funnet. Oppretter admin...")
            user = User.objects.create_superuser('admin', 'admin@example.com', 'pass123')

        self.stdout.write("Sletter gammel data...")
        Event.objects.all().delete()
        Listing.objects.all().delete()
        Company.objects.all().delete()

        # Konfigurasjon
        categories = ['Sosialt', 'Kurs', 'Bedriftspresentasjon', 'Idrett', 'Konsert']
        cities = ['Trondheim', 'Oslo', 'Bergen', 'Stavanger', 'Tromsø' ]
        job_types = ['Fulltid', 'Deltid', 'Internship', 'Sommerjobb']
        company_names = ['BDO', 'Equinor', 'Itera', 'Sopra Steria', 'Netlight', 'Kongsberg']

        # 2. Generer firmaer
        self.stdout.write("Genererer firmaer...")
        companies = []
        for name in company_names:
            company = Company.objects.create(
                name=name,
                description=fake.paragraph(nb_sentences=3),
                created_by=user
            )
            companies.append(company)

        # 3. Generer arrangementer
        self.stdout.write("Genererer 25 arrangementer...")
        for _ in range(25):
            Event.objects.create(
                title=fake.catch_phrase(),
                category=random.choice(categories),
                # Vi bruker en fast start_date for at datoene skal bli like
                date=fake.date_between(start_date='today', end_date='+90d'),
                description=fake.paragraph(nb_sentences=5),
                places=random.choice(['Ballsalen', 'Edgar', 'Klubben', 'Strossa']),
                capacity=random.randint(20, 500),
                created_by=user
            )

        # 4. Generer jobbannonser
        self.stdout.write("Genererer 20 jobbannonser...")
        for _ in range(20):
            Listing.objects.create(
                title=fake.job(),
                company=random.choice(companies),
                description=fake.text(max_nb_chars=1000),
                employment_type=random.choice(job_types),
                city=random.choice(cities),
                created_by=user
            )

        self.stdout.write(self.style.SUCCESS(
            f'Ferdig! Generert {Company.objects.count()} firmaer, '
            f'{Event.objects.count()} events og {Listing.objects.count()} annonser. '
            f'Dataene er identiske med forrige kjøring pga. SEED {SEED}.'
        ))