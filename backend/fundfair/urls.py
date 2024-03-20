from django.urls import path
from .views import *

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', user_registration_view, name='user_registration'),
    path('login/', login_view, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('link-wallet/', wallet_linking_view, name='link_wallet'),
    path('verify-email/', email_verification_view, name='email_verification'),
    
    # user profile
    path('profile/', user_profile_view, name='user_profile_update'),

    # campaign
    path('campaign/create/', create_campaign_view, name='create_campaign'),
    path('campaigns/all/', get_all_campaigns_view, name='campaigns'),
    path('campaign/<int:id>/', get_campaign_by_id_view, name='campaign_detail'),
    # get funders
]
