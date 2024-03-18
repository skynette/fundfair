from web3 import Web3 
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .utils import create_verification_code, verify_code

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False
        )

        code = create_verification_code(validated_data['email'])
        if code == "error":
            raise serializers.ValidationError("Error sending email.")

        return user


class EmailVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)
    email = serializers.EmailField(required=True)

    
    def verify_otp(self, email, otp):
        """Verify OTP from email."""
        res = verify_code(email, otp)
        if res == 'approved':
            return True
        return False

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError('User not found.')
        
        if not self.verify_otp(email, otp):
            raise serializers.ValidationError('Invalid or expired OTP.')
        return attrs

    def save(self, **kwargs):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        user.email_verified = True
        user.save()



class WalletLinkingSerializer(serializers.Serializer):
    wallet_address = serializers.CharField(max_length=42)

    def validate_wallet_address(self, value):
        """Validate Ethereum address."""

        if not Web3.isAddress(value):
            raise serializers.ValidationError("This is not a valid Ethereum address.")
        return value
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'wallet_address')
        read_only_fields = ('username', 'wallet_address') 