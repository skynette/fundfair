import requests
import datetime
from decimal import Decimal

from django.utils import timezone
from datetime import timedelta

from .emails import send_verification_email
from .models import EmailVerification 

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
        email_verification = EmailVerification.objects.filter(email=email).latest('created_at')

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


def get_op_to_usd_rate():
    """Fetches the current conversion rate from Optimism (OP) to USD."""
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd')
        response.raise_for_status()  # Raises stored HTTPError, if one occurred
        rate = response.json().get('optimism', {}).get('usd', 0)
        return rate
    
    except requests.RequestException as error:
        print(f'Error converting OP to USD: {error}')
        return 0


def format_campaign_data(w3, campaign_data, funders_data):
    """Formats the raw campaign data from the smart contract into a more user-friendly format."""
    
    op_to_usd_rate = Decimal(get_op_to_usd_rate())

    # Ensure funders_data has the expected structure
    if len(funders_data) >= 2 and isinstance(funders_data[1], list):
        donations_op = [Decimal(w3.fromWei(donation, 'ether')) for donation in funders_data[1]]
    else:
        donations_op = []

    donations_usd = [donation_op * op_to_usd_rate for donation_op in donations_op]

    formatted_data = {
        "owner": campaign_data[0] if len(campaign_data) > 0 else None,
        "title": campaign_data[1] if len(campaign_data) > 1 else None,
        "description": campaign_data[2] if len(campaign_data) > 2 else None,
         "target": Decimal(w3.fromWei(campaign_data[3], 'ether')),
        "targetInUsd": Decimal(w3.fromWei(campaign_data[3], 'ether')) * op_to_usd_rate,
        "amountRaised": Decimal(w3.fromWei(campaign_data[5], 'ether')),
        "amountRaisedUSD": Decimal(w3.fromWei(campaign_data[5], 'ether')) * op_to_usd_rate,
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