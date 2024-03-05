from django.urls import path
from .views import *

urlpatterns = [
    path('register/', user_registration_view, name='user_registration'),
    path('login/', wallet_verification_view, name='wallet_verification'),
    path('verify-email/', email_verification_view, name='email_verification'),
    
    # user profile
    path('profile/', user_profile_view, name='user_profile_update'),
    
]
