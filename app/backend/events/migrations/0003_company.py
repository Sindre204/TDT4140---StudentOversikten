from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0002_registration"),
        migrations.swappable_dependency("auth.User"),
    ]

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("industry", models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="auth.user")),
            ],
        ),
    ]
