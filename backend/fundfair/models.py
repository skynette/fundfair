from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False) 
    def __str__(self) -> str:
        return f"{self.username} {self.email} {self.wallet_address}"