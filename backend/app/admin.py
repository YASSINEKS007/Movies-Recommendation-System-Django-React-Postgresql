from django.contrib import admin
from .models import Movies, Ratings, CustomUser

# Register your models here.
admin.site.register(Movies)
admin.site.register(CustomUser)
admin.site.register(Ratings)
