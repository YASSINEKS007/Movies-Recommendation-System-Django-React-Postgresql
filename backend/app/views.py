import json

import bcrypt
from bson import json_util
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Movies, CustomUser
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
                "refresh_token": str(refresh),
                "access_token": (
                    str(refresh.access_token)
                    if hasattr(refresh, "access_token")
                    else ""
                ),
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
    print("Search term:", s)
    return Response({"search_term": serializer.data}, status=status.HTTP_200_OK)