from web3 import Web3 
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    wallet_address = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'wallet_address')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_wallet_address(self, value):
        """Validate Ethereum address or ENS."""
        
        if not (Web3.isAddress(value) or value.endswith('.eth')):
            raise serializers.ValidationError("This is not a valid Ethereum address or ENS name.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # TODO: Send OTP for email verification
        
        self.send_verification_email(user.email)
        return user

    def send_verification_email(self, email):
        """Send OTP to email."""
        pass


class EmailVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)
    email = serializers.EmailField(required=True)

    
    def verify_otp(self, email, otp):
        """Verify OTP from email."""
        return True

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError('User not found.')
        
        if not self.verify_otp(email, otp):
            raise serializers.ValidationError('Invalid OTP.')
        return attrs

    def save(self, **kwargs):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        user.email_verified = True
        user.save()



class WalletVerificationSerializer(serializers.Serializer):
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