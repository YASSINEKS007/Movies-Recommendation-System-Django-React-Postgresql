from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class Movies(models.Model):
    movieid = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    genres = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'movies'

    def __str__(self):
        return self.title



from django.db import models

class Ratings(models.Model):
    id = models.AutoField(primary_key=True)
    userid = models.IntegerField()
    movieid = models.IntegerField()
    rating = models.FloatField()
    timestamp = models.IntegerField()
    
    class Meta:
        managed = False  
        db_table = 'ratings'

    def __str__(self):
        return str(self.rating)

    

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
