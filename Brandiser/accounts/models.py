from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager,PermissionsMixin
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,username,email,password=None,**extra_fields):
        if not username:
            raise ValueError('The UserName must be set');
        if not email:
            raise ValueError('The Email must be set');
        username = username.lower()
        email = self.normalize_email(email)
        user = self.model(username=username,email=email,**extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user
    def create_superuser(self,username,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)

        return self.create_user(username,email,password,**extra_fields)

class User(AbstractUser,PermissionsMixin):
    username = models.CharField(max_length=150,unique=True)
    email = models.EmailField(max_length=255,unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length = 150)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']