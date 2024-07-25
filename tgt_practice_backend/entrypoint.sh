#!/bin/sh

poetry run python manage.py migrate --no-input
poetry run python manage.py collectstatic --no-input

poetry run gunicorn --bind :8000 tools_app.wsgi:application
