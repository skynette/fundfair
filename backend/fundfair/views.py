from decimal import Decimal
from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .utils import batch_format_campaign_data, ether_to_wei, format_campaign_data, get_eth_to_usd
from .models import Campaign
from .serializers import CampaignSerializer, EmailVerificationSerializer, LoginSerializer, UserProfileSerializer, UserRegistrationSerializer, WalletLinkingSerializer

from web3 import Web3
from web3.middleware import geth_poa_middleware


User = get_user_model()


def setup_web3():
    """Setup web3 connection and load contract."""
    RPC_URL = "https://sepolia.optimism.io"
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)

    # Ensure connection to blockchain
    if not w3.is_connected():
        print("NOT CONNECTED")
        return False, False

    try:
        # Load contract
        contract_address = Web3.toChecksumAddress(settings.CONTRACT_ADDRESS)
        contract = w3.eth.contract(address=contract_address, abi=settings.CONTRACT_ABI)
        print("w3", w3, "contract", contract)
        return w3, contract
    except Exception as e:
        print("An error occurred", e)
        return False, False



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


class CreateCampaignView(generics.GenericAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        request=CampaignSerializer,
        responses={
            status.HTTP_201_CREATED: OpenApiResponse(
                description="Campaign successfully created and linked to the user's blockchain wallet address.",
                response=CampaignSerializer
            ),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(
                description="Invalid data submitted. Required fields may be missing or contain incorrect values."
            ),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(
                description="An error occurred while creating the campaign on the blockchain or within the application."
            )
        },
        description="Creates a new campaign and links it to the user's blockchain wallet address. The endpoint expects details of the campaign such as title, description, target amount, etc., in the request body. It also interacts with the blockchain to create the campaign there."
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            campaign_data = serializer.validated_data
            campaign_instance = serializer.instance

            # Setup web3 connection and load contract
            w3, contract = setup_web3()
            try:
                # Prepare transaction
                target = ether_to_wei(campaign_data['target'])
                transaction = contract.functions.createCampaign(
                    campaign_data['owner'],
                    campaign_data['title'],
                    campaign_data['description'],
                    target,
                    int(campaign_data['deadline']),
                    campaign_instance.image.url,
                    campaign_data['fundingModel'],
                    campaign_data['category']
                ).buildTransaction({
                    'chainId': settings.CHAIN_ID,
                    'gas': 2000000,
                    'nonce': w3.eth.getTransactionCount(settings.CONTRACT_OWNER_ADDRESS),
                })

                signed_txn = w3.eth.account.signTransaction(transaction, private_key=settings.WALLET_SECRET_KEY)

                # Send transaction
                txn_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
                txn_receipt = w3.eth.waitForTransactionReceipt(txn_hash)

                return Response({
                        "success": serializer.data, 
                        "message": "Campaign successfully created and linked to the user's blockchain wallet address.",
                        "transaction_hash": txn_hash.hex(),
                    }, status=status.HTTP_201_CREATED)

            except Exception as e:
                print("Error: ", e)
                return Response({"message": "An error occurred while creating the campaign on the blockchain."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def perform_create(self, serializer):
        serializer.save()


create_campaign_view = CreateCampaignView.as_view()



class GetCampaignByIDView(generics.GenericAPIView):
    @extend_schema(
        responses={
            200: OpenApiResponse(description="Successfully retrieved campaign details."),
            400: OpenApiResponse(description="Invalid request: Campaign ID is required."),
            404: OpenApiResponse(description="Campaign not found."),
            500: OpenApiResponse(description="A server error occurred."),
        },
        description="Retrieves a single campaign's details from the blockchain by its index.",
        parameters=[{
            'name': 'id',
            'description': 'Index of the campaign in the smart contract array',
            'required': True,
            'in': 'path',
            'schema': {
                'type': 'integer',
                'format': 'int64'
            }
        }],
    )
    def get(self, request, *args, **kwargs):
        campaign_id = kwargs.get('id', None)
        if campaign_id is None:
            return Response({"message": "Campaign ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Setup web3 connection and load contract
        w3, contract = setup_web3()

        try:
            # Fetch campaign data
            campaign_data = contract.functions.campaigns(campaign_id).call()
            # Fetch funders data
            funders_data = contract.functions.getFunders(campaign_id).call()

            formatted_data = format_campaign_data(w3, campaign_data, funders_data)
            return Response(formatted_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

get_campaign_by_id_view = GetCampaignByIDView.as_view()


class GetAllCampaignsView(generics.GenericAPIView):
    
    @extend_schema(
        responses={
            200: OpenApiResponse(description="Successfully retrieved all campaigns."),
            500: OpenApiResponse(description="A server error occurred."),
        },
        description="Retrieves all campaigns from the blockchain, formats them for the frontend, and includes an index for each."
    )
    def get(self, request, *args, **kwargs):
        # Setup web3 connection and load contract
        w3, contract = setup_web3()
        
        try:
            all_campaigns_data = contract.functions.getCampaigns().call()
            op_to_usd_rate = Decimal(get_eth_to_usd())
            formatted_campaigns = []

            # Process each campaign
            for index, campaign_data in enumerate(all_campaigns_data):
                formatted_campaign = batch_format_campaign_data(w3, campaign_data, op_to_usd_rate)
                formatted_campaign['index'] = index
                formatted_campaigns.append(formatted_campaign)

            return Response({"success": formatted_campaigns}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


get_all_campaigns_view = GetAllCampaignsView.as_view()
