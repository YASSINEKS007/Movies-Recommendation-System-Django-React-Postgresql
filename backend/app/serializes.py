from rest_framework import serializers
from .models import Movies, Ratings, CustomUser


class MoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movies
        fields = ["movieid", "title", "genres"]


class RatingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ratings
        fields = ["userId", "movieid", "rating", "timestamp"]
