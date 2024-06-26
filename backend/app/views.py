import json

import bcrypt
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from utils import get_db_handle
from bson import json_util


db, client = get_db_handle()


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    collection = db["users"]
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            username = data.get("username")

            if not email or not password:
                return JsonResponse(
                    {"error": "Email and password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user_dict = collection.find_one({"email": email})
            if user_dict != None:
                return JsonResponse(
                    {"error": "User Already Exists"},
                    status=status.HTTP_409_CONFLICT,
                )

            hashed_password = bcrypt.hashpw(
                password.encode("utf-8"), bcrypt.gensalt()
            ).decode("utf-8")

            collection = db["users"]

            pipeline = [{"$group": {"_id": None, "max_userId": {"$max": "$userId"}}}]
            result = list(collection.aggregate(pipeline))
            highest_userId = (
                result[0]["max_userId"]
                if result and result[0] and "max_userId" in result[0]
                else 0
            )
            new_userId = highest_userId + 1

            user_data = {
                "userId": new_userId,
                "email": email,
                "password": hashed_password,
                "username": username,
            }

            collection.insert_one(user_data)

            return JsonResponse(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )

        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return JsonResponse(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return JsonResponse(
        {"error": "POST method required"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    collection = db["users"]
    try:
        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST
        )

    user_dict = collection.find_one({"email": email})
    if not user_dict:
        return JsonResponse(
            {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
        )

    stored_hashed_password = user_dict.get("password", "")

    if bcrypt.checkpw(password.encode("utf-8"), stored_hashed_password.encode("utf-8")):

        refresh = RefreshToken()
        user_dict.pop("_id")

        return JsonResponse(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": json.dumps(user_dict, default=json_util.default),
            }
        )

    else:
        return JsonResponse(
            {"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED
        )
