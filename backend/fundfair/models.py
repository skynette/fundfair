from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False) 
    def __str__(self) -> str:
        return f"{self.username} {self.email} {self.wallet_address}"
    

class EmailVerification(models.Model):
    code = models.CharField(max_length=6)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.email} {self.code}"
    
    class Meta:
        ordering = ['-created_at']


class ImageUpload(models.Model):
    image = models.ImageField(upload_to="campaign_images/", null=True, blank=True)
