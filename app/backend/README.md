# How to run the backend

Follow these steps from your terminal to set up and run the Django backend.

---

## 1) Go to the project folder

You want the directory that contains `manage.py`.

```bash
cd path/to/your/project
ls
```

---

## 2) Create and activate a virtual environment

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows (PowerShell)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

---

## 3) Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4) Install Django CORS headers

```bash
pip install django-cors-headers
```

---

## 5) Install Pillow (required for images)

```bash
python -m pip install Pillow
```

---

## 6) Run migrations

```bash
python manage.py migrate
```

---

## 7) Create a superuser

```bash
python manage.py createsuperuser
```

---

## 8) Start the development server

```bash
python manage.py runserver
```

---

## 9) Open the admin page

Add `/admin/` to the end of the URL, or open:

- http://127.0.0.1:8000/admin/

You can now log in with your superuser and edit content in the admin panel.


## 10. Seed the database with test data (optional)

If you want pre-generated content in the database, you can use the built-in seed script.

### Install Faker

```bash
pip install faker
```

### Run the seed command

```bash
python manage.py seed_db
```

This will generate:

- 6 companies
- 25 events
- 20 job listings

All data is owned by the first superuser in the system, so **the superuser must be created before this step**.