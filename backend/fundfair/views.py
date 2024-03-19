from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import EmailVerificationSerializer, ImageUploadSerializer, LoginSerializer, UserProfileSerializer, UserRegistrationSerializer, WalletLinkingSerializer

# from thirdweb import ThirdwebSDK
# from thirdweb.types import SDKOptions


# sdk = ThirdwebSDK("op-sepolia-testnet", options=SDKOptions(secret_key="YOUR_SECRET_KEY"))
# contract = sdk.get_contract("0x964C12A4c0bbFB49Ba18bFD02A5332D37D3083d2")


# # to create a campaign
# data = contract.call("createCampaign", _owner, _title, _description, _target, _deadline, _image, _fundingModel, _category)

User = get_user_model()


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = UserRegistrationSerializer

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserRegistrationSerializer},
        description="Register a new user account",
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = TokenObtainPairSerializer.get_token(user)

            return Response({
                'user': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username,
                    'email': user.email,
                },
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'User registered successfully',
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


user_registration_view = UserRegistrationView.as_view()


class CustomTokenObtainPairView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = TokenObtainPairSerializer.get_token(user)
            
            return Response({
                'user': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username,
                    'email': user.email,
                },
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'User Login successfully',
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


login_view = CustomTokenObtainPairView.as_view()


class EmailVerificationView(generics.GenericAPIView):
    serializer_class = EmailVerificationSerializer

    @extend_schema(
        request=EmailVerificationSerializer,
        responses={
            200: OpenApiResponse(description="Email verified successfully"),
            400: OpenApiResponse(description="Invalid request with details")
        },
        description="Verify a user's email address",
    )
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

email_verification_view = EmailVerificationView.as_view()


class WalletLinkingView(generics.GenericAPIView):
    serializer_class = WalletLinkingSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=WalletLinkingSerializer,
        responses={
            200: OpenApiResponse(description="Wallet successfully linked to the account."),
            400: OpenApiResponse(description="Invalid data."),
            409: OpenApiResponse(description="This wallet is already linked to another account."),
        },
        description="Link a user's wallet address to their account",
    )
    def post(self, request):
        serializer = WalletLinkingSerializer(data=request.data)
        if serializer.is_valid():
            wallet_address = serializer.validated_data['wallet_address']
            user = request.user 

            if user.wallet_address:
                return Response({"message": "An existing wallet is already linked to this account."}, status=status.HTTP_409_CONFLICT)

            if User.objects.filter(wallet_address=wallet_address).exists():
                return Response({"message": "This wallet is already linked to another account."}, status=status.HTTP_409_CONFLICT)

            user.wallet_address = wallet_address
            user.save()
            return Response({"message": "Wallet successfully linked to the account.", "wallet_address": wallet_address}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


wallet_linking_view = WalletLinkingView.as_view()


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserProfileSerializer},
        description="Retrieve the authenticated user's profile information",
    )
    def get(self, request):
        user = request.user
        user_serializer = UserProfileSerializer(user)
        return Response(user_serializer.data)


user_profile_view = UserProfileView.as_view()


class ImageUploadView(generics.GenericAPIView):
    serializer_class = ImageUploadSerializer

    def post(self, request, format=None):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

image_upload_view = ImageUploadView.as_view()
