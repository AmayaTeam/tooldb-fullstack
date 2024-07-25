from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_protect
from graphene_django.views import GraphQLView
from django.conf import settings
from django.conf.urls.static import static

from api import views
from api.schema import schema
from api.views import graphql_docs
from tools_app import settings

sub_patterns = [
    settings.AUTH.urlpattern,
    path("", views.index),
    path("logout_user", views.logout_user, name="logout_user"),
    path("call_api", views.call_api, name="call_api"),
    path("graphql/", csrf_protect(GraphQLView.as_view(graphiql=True, schema=schema))),
    path("docs", graphql_docs, name="graphql_docs"),
    path("admin/", admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns = [
    path("api/", include(sub_patterns)),
]
