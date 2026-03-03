from django.contrib.auth.hashers import make_password
from django.db import migrations


COMPANY_GROUP_NAME = "company"
COMPANY_EMAIL = "pwc@pwc.com"
COMPANY_PASSWORD = "testpwc123"
COMPANY_NAME = "PwC"


def seed_default_company_user(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    User = apps.get_model("auth", "User")

    company_group, _ = Group.objects.get_or_create(name=COMPANY_GROUP_NAME)

    user = (
        User.objects.filter(username=COMPANY_EMAIL).first()
        or User.objects.filter(email=COMPANY_EMAIL).first()
    )

    if user is None:
        user = User.objects.create(
            username=COMPANY_EMAIL,
            email=COMPANY_EMAIL,
            first_name=COMPANY_NAME,
            password=make_password(COMPANY_PASSWORD),
            is_active=True,
        )
    else:
        user.username = COMPANY_EMAIL
        user.email = COMPANY_EMAIL
        user.first_name = COMPANY_NAME
        user.password = make_password(COMPANY_PASSWORD)
        user.is_active = True
        user.save(update_fields=["username", "email", "first_name", "password", "is_active"])

    user.groups.add(company_group)


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("events", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_default_company_user, migrations.RunPython.noop),
    ]
