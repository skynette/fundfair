from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False) 
    def __str__(self) -> str:
        return f"{self.username} {self.email} {self.wallet_address}"
    

class EmailVerification(models.Model):
    code = models.CharField(max_length=6)
    email = models.CharField(max_length=42)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.email} {self.code}"
    
    class Meta:
        ordering = ['-created_at']




class Campaign(models.Model):
    owner = models.CharField(max_length=42) 
    title = models.CharField(max_length=255)
    description = models.TextField()
    target = models.BigIntegerField()
    deadline = models.DateTimeField()
    amountRaised = models.BigIntegerField(default=0)
    image = models.ImageField(upload_to='campaign_images/')
    donators = models.JSONField(default=list, blank=True)
    donations = models.JSONField(default=list, blank=True)
    isFundingGoalReached = models.BooleanField(default=False)
    isCampaignClosed = models.BooleanField(default=False)
    fundingModel = models.CharField(max_length=10)
    category = models.IntegerField() 

    def __str__(self) -> str:
        return f"{self.title} {self.owner} {self.target} {self.amountRaised} {self.isFundingGoalReached} {self.isCampaignClosed}"
    
    class Meta:
        ordering = ['-id']
