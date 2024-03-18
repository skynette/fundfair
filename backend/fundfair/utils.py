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
