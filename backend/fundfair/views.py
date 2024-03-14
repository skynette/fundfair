from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import EmailVerificationSerializer, UserProfileSerializer, UserRegistrationSerializer, WalletLinkingSerializer

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
        request=WalletLinkingSerializer,
        responses={200: UserProfileSerializer},
        description="Retrieve a user's profile information",
    )
    def post(self, request):
        wallet_serializer = WalletLinkingSerializer(data=request.data)
        if wallet_serializer.is_valid():
            wallet_address = wallet_serializer.validated_data['wallet_address']
            try:
                user = User.objects.get(wallet_address=wallet_address)
                user_serializer = UserProfileSerializer(user)
                return Response(user_serializer.data)
            except User.DoesNotExist:
                return Response({"message": "No user associated with this wallet address"}, status=status.HTTP_404_NOT_FOUND)

        return Response(wallet_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

user_profile_view = UserProfileView.as_view()
