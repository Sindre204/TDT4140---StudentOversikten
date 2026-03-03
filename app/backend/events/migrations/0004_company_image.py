from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0003_company"),
    ]

    operations = [
        migrations.AddField(
            model_name="company",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="companies/"),
        ),
    ]
