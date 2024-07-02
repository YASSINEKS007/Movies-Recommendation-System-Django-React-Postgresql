import json

import numpy as np
import pandas as pd
from django.contrib.auth import authenticate
from recommendation_system import (
    create_ratings_matrix,
    fill_ratings_matrix,
    get_item_details,
    merge_data,
    recreate_ratings_matrix,
    retrieve_user_ratings,
    svd_matrix_decomposition,
    get_average_rating,
)
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Movies, Ratings
from .serializes import MoviesSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            username = data.get("username")

            if not email or not password:
                return Response(
                    {"error": "Email and password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if a user with the given email already exists
            user = CustomUser.objects.filter(email=email).first()
            if user is not None:
                return Response(
                    {"error": "User Already Exists"},
                    status=status.HTTP_409_CONFLICT,
                )

            # Create a new user if one doesn't exist with the given email
            new_user = CustomUser.objects.create_user(
                email=email,
                password=password,
                username=username,
            )

            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )

        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return Response(
        {"error": "POST method required"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return Response(
                {"error": "Both email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        authenticated_user = authenticate(email=email, password=password)
        if not authenticated_user:
            return Response(
                {"error": "Incorrect password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Authentication successful, generate tokens
        refresh = RefreshToken.for_user(authenticated_user)

        # Prepare user data to serialize
        user_dict = {
            "id": authenticated_user.id,
            "email": authenticated_user.email,
            "username": authenticated_user.username,
        }

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": user_dict,
            },
            status=status.HTTP_200_OK,
        )

    except json.JSONDecodeError:
        return Response(
            {"error": "Invalid JSON format in request body."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search(request):
    s = request.GET.get("s")
    results = Movies.objects.filter(title__istartswith=s)
    serializer = MoviesSerializer(results, many=True)
    return Response({"search_term": serializer.data}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fetch_movies(request):
    movies = Movies.objects.all()
    serializer = MoviesSerializer(movies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


movies = Movies.objects.all().values()
movies_df = pd.DataFrame.from_records(movies)
ratings = Ratings.objects.all().values("userid", "movieid", "rating", "timestamp")
ratings_df = pd.DataFrame.from_records(ratings)
merged_data = merge_data(ratings_df, movies_df, "movieid")
ratings_matrix = create_ratings_matrix(merged_data, "userid", "movieid", "rating")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    userId = int(request.GET.get("userId"))
    ratings_matrix_filled = fill_ratings_matrix(ratings_matrix)
    U, sigma, Vt = svd_matrix_decomposition(ratings_matrix_filled)
    res = recreate_ratings_matrix(ratings_matrix, U, sigma, Vt)
    sorted_dict = dict(
        sorted(
            retrieve_user_ratings(userId, res).items(),
            key=lambda item: item[1],
            reverse=True,
        )
    )
    top_recommendations_keys = list(sorted_dict.keys())[:20]

    top_recommendations = []
    for key in top_recommendations_keys:
        top_recommendations.append(get_item_details(movies_df, key))

    return Response(top_recommendations, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def average_rating(request):
    item_id = int(request.GET.get("itemId"))
    average_rating = get_average_rating(ratings_matrix, item_id)
    return Response(average_rating, status=status.HTTP_200_OK)
