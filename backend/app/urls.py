from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("search/", views.search, name="search"),
    path("movies/", views.fetch_movies, name="fetch_movies"),
    path("recommendations/", views.get_recommendations, name="recommendations"),
    path("averageRating/", views.average_rating, name="averageRating"),
]
