from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import EmailVerificationSerializer, UserProfileSerializer, UserRegistrationSerializer, WalletVerificationSerializer


User = get_user_model()


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = UserRegistrationSerializer

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserRegistrationSerializer},
        description="Register a new user account",
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
        
            return Response({
                "message": "User registered successfully",
                "username": user.username,
                "wallet_address": user.wallet_address
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


class WalletVerificationView(generics.GenericAPIView):
    serializer_class = WalletVerificationSerializer

    @extend_schema(
        request=WalletVerificationSerializer,
        responses= {
            200: OpenApiResponse(description="Wallet associated with an existing user"),
            404: OpenApiResponse(description="No account associated with this wallet. Please create an account.")
        },
        description="Verify a user's wallet address",
    )
    def post(self, request):
        serializer = WalletVerificationSerializer(data=request.data)
        if serializer.is_valid():
            wallet_address = serializer.validated_data['wallet_address']
            try:
                user = User.objects.get(wallet_address=wallet_address)
                return Response({"message": "Wallet associated with an existing user.", "username": user.username, "email": user.email}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"message": "No account associated with this wallet. Please create an account."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

wallet_verification_view = WalletVerificationView.as_view()


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer

    @extend_schema(
        request=WalletVerificationSerializer,
        responses={200: UserProfileSerializer},
        description="Retrieve a user's profile information",
    )
    def post(self, request):
        wallet_serializer = WalletVerificationSerializer(data=request.data)
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
