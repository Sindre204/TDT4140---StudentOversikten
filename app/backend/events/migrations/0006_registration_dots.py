from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0005_merge_20260303_1505"),
    ]

    operations = [
        migrations.AddField(
            model_name="registration",
            name="dots",
            field=models.PositiveSmallIntegerField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(3),
                ],
            ),
        ),
    ]
