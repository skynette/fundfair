from django.urls import path
from .views import *

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/', user_registration_view, name='user_registration'),
    path('login/', wallet_verification_view, name='wallet_verification'),
    path('verify-email/', email_verification_view, name='email_verification'),
    
    # user profile
    path('profile/', user_profile_view, name='user_profile_update'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]
