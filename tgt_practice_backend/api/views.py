import os
import random
import string

from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Group
from django.shortcuts import redirect
from graphene_django.views import GraphQLView
import requests
import graphdoc

__version__ = "0.2.0"


def index(request):
    return redirect("call_api")


@settings.AUTH.login_required(scopes=["User.Read", "Directory.Read.All"])
def call_api(request, *, context):
    if context["access_token"]:
        api_result = requests.get(
            "https://graph.microsoft.com/v1.0/me/appRoleAssignments",
            headers={"Authorization": "Bearer " + context["access_token"]},
            timeout=30,
        )
        api_result2 = requests.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": "Bearer " + context["access_token"]},
            timeout=30,
        )

        user_info = api_result2.json()
        user, created = User.objects.get_or_create(
            username=user_info["userPrincipalName"]
        )
        if created:
            app_role_id = api_result.json()["value"][0]["appRoleId"]
            if app_role_id == "0be6dabc-574d-4913-8652-befb6d290ed5":
                group, _ = Group.objects.get_or_create(name="manager")
            else:
                group, _ = Group.objects.get_or_create(name="user")
            user.groups.add(group)
            user.save()
        login(request, user)

        redirect_url = os.getenv("REDIRECT_URL_TO_HOME")

        return redirect(redirect_url)


def graphql_docs(request):
    html = graphdoc.to_doc(GraphQLView().schema.graphql_schema)
    return HttpResponse(html, content_type="text/html")


def logout_user(request):
    logout(request)
    return redirect(os.getenv("REDIRECT_URL_TO_ROOT_FRONTEND"))
