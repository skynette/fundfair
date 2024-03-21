import requests
import datetime
from decimal import Decimal

from django.utils import timezone
from datetime import timedelta

from .emails import send_verification_email
from .models import EmailVerification 

from django.conf import settings

def create_verification_code(email):
    """
    Function to create a verification code, save it to the database, and send it via email.
    :param email: Email for sending the verification code.
    :return: The generated verification code.
    """
    import random
    import string

    # Generate a 6-digit random code
    code = ''.join(random.choices(string.digits, k=6))

    # Save the code to the database with an expiration setup handled by created_at
    verification_obj, created = EmailVerification.objects.get_or_create(email=email)
    verification_obj.code = code
    verification_obj.save()

    # Send the code via email
    try:
        send_verification_email(email, code)
        return code
    except Exception as e:
        print("AN ERROR OCCURRED WHILE SENDING EMAIL: ", e)
        return "error"


def verify_code(email, code):
    """
    Function to verify the provided code against the stored code for the given email.
    :param email: Email for which the code is to be verified.
    :param code: Verification code to be verified.
    :return: 'approved' if the code is valid, 'failed_expired' if the code is expired, 'failed' if the code is invalid.
    """
    try:
        email_verification = EmailVerification.objects.filter(email=email).first()
        time_difference = timezone.now() - email_verification.created_at

        if time_difference > timedelta(minutes=60):
            email_verification.delete()
            return 'failed_expired'
        elif email_verification.code == code:
            email_verification.delete()
            return 'approved'
        else:
            return 'failed'
    except EmailVerification.DoesNotExist:
        return 'failed'


def get_eth_to_usd():
    """Fetches the current conversion rate from ethereum (OP) to USD."""
    try:
        response = requests.get(f"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
        response.raise_for_status()  # Raises stored HTTPError, if one occurred
        rate = response.json().get('ethereum', {}).get('usd', 0)
        return rate
    
    except requests.RequestException as error:
        print(f'Error converting OP to USD: {error}')
        return 0


def format_campaign_data(w3, campaign_data, funders_data):
    """Formats the raw campaign data from the smart contract into a more user-friendly format."""
    
    eth_to_usd = Decimal(get_eth_to_usd())

    # Ensure funders_data has the expected structure
    if len(funders_data) >= 2 and isinstance(funders_data[1], list):
        donations_op = [Decimal(w3.fromWei(donation, 'ether')) for donation in funders_data[1]]
    else:
        donations_op = []

    donations_usd = [donation_op * eth_to_usd for donation_op in donations_op]
    deadline_readable = datetime.datetime.utcfromtimestamp(campaign_data[4]).strftime('%Y-%m-%d %H:%M:%S')

    formatted_data = {
        "owner": campaign_data[0] if len(campaign_data) > 0 else None,
        "title": campaign_data[1] if len(campaign_data) > 1 else None,
        "description": campaign_data[2] if len(campaign_data) > 2 else None,
        "target": Decimal(w3.fromWei(campaign_data[3], 'ether')),
        "targetInUsd": Decimal(w3.fromWei(campaign_data[3], 'ether')) * eth_to_usd,
        "deadline": deadline_readable,
        "amountRaised": Decimal(w3.fromWei(campaign_data[5], 'ether')),
        "amountRaisedUSD": Decimal(w3.fromWei(campaign_data[5], 'ether')) * eth_to_usd,
        "image": campaign_data[6] if len(campaign_data) > 6 else None,
        "isFundingGoalReached": campaign_data[7] if len(campaign_data) > 7 else False,
        "isCampaignClosed": campaign_data[8] if len(campaign_data) > 8 else False,
        "fundingModel": campaign_data[9] if len(campaign_data) > 9 else None,
        "category": campaign_data[10] if len(campaign_data) > 10 else None,
        "donators": funders_data[0] if len(funders_data) > 0 else [],
        "donations": donations_op,
        "donationsUSD": donations_usd,
        "totalDonated": sum(donations_op),
        "totalDonatedUSD": sum(donations_usd),
        "totalDonators": len(funders_data[0]) if len(funders_data) > 0 else 0
    }

    return formatted_data

def safe_extract_big_number(w3, value):
    return Decimal(w3.fromWei(value, 'ether'))


def batch_format_campaign_data(w3, campaign_data, eth_to_usd):
    """Formats the raw campaign data from an array of campaigns coming from a smart contract into a more user-friendly format.

    Args:
    - w3: An instance of Web3.
    - campaigns_data: The raw campaign data from the smart contract, expected to be a list of campaigns.

    Returns:
    A list of dictionaries, each containing formatted campaign information.
    """
    if not isinstance(campaign_data, tuple) or len(campaign_data) < 12:
        return {"error": "Invalid campaign data format"}

    (
        owner, title, description, target, deadline, 
        amount_raised, image, donators, donations, 
        isFundingGoalReached, isCampaignClosed, fundingModel, category
    ) = campaign_data

    # Convert from Wei to Ether
    wei_to_ether = Decimal(10**18)
    target_eth = Decimal(target) / wei_to_ether
    amount_raised_eth = Decimal(amount_raised) / wei_to_ether
    donations_eth = [Decimal(donation) / wei_to_ether for donation in donations]

    # Ensure eth_to_usd is a Decimal
    eth_to_usd = Decimal(eth_to_usd)

    # Now convert Ether values to USD
    target_usd = float(target_eth * eth_to_usd)
    amount_raised_usd = float(amount_raised_eth * eth_to_usd)
    donations_usd = [float(donation_eth * eth_to_usd) for donation_eth in donations_eth]

    # Format the data into a dictionary
    formatted_data = {
        "owner": owner,
        "title": title,
        "description": description,
        "target": float(target_eth),
        "targetInUsd": target_usd,
        # "deadline": datetime.datetime.utcfromtimestamp(deadline).strftime('%Y-%m-%d %H:%M:%S'),
        "amountRaised": float(amount_raised_eth),
        "amountRaisedUSD": amount_raised_usd,
        "image": image,
        "isFundingGoalReached": isFundingGoalReached,
        "isCampaignClosed": isCampaignClosed,
        "fundingModel": fundingModel,
        "category": category,
        "donators": donators,
        "donations": [float(donation_eth) for donation_eth in donations_eth],
        "donationsUSD": donations_usd,
        "totalDonated": sum([float(donation_eth) for donation_eth in donations_eth]),
        "totalDonatedUSD": sum(donations_usd),
        "totalDonators": len(donators),
    }

    return formatted_data


def ether_to_wei(ether_str):
    """
    Convert an Ether value given as a string to Wei.
    
    Args:
    ether_str (str): The Ether value as a string.
    
    Returns:
    int: The corresponding value in Wei.
    """
    # Convert string to a float, then multiply by 10^18 and convert to int
    ether_value = float(ether_str)
    wei_value = int(ether_value * 1e18)
    return wei_value
