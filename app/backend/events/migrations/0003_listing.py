import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0002_rename_location_event_places_event_capacity_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Listing",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("company", models.CharField(max_length=200)),
                (
                    "employment_type",
                    models.CharField(
                        choices=[
                            ("fulltime", "Full-time"),
                            ("parttime", "Part-time"),
                            ("internship", "Internship"),
                            ("summerjob", "Summer job"),
                        ],
                        max_length=20,
                    ),
                ),
                ("location", models.CharField(max_length=100)),
                ("image", models.ImageField(blank=True, null=True, upload_to="events/")),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
