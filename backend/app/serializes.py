from rest_framework import serializers
from .models import Movie, Ratings, User


class MovieSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(read_only=True)

    class Meta:
        model = Movie
        fields = ["_id", "movieId", "title", "genres"]


class RatingsSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(read_only=True)

    class Meta:
        model = Ratings
        fields = ["_id", "userId", "movieId", "timestamp"]


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["userId", "email", "username", "password", "date_joined"]
