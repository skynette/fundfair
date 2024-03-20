from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from zcore.settings import EMAIL_HOST_USER

from_email = EMAIL_HOST_USER


def send_verification_email(email, otp):
	"""Function to send verification email with OTP."""
	print("SENDING EMAIL TO: ", email, "WITH OTP: ", otp)
	context = {
		"email": email,
		"otp": otp
	}
	html_content = render_to_string("emails/email_code.html", context)
	text_content = strip_tags(html_content)
	email = EmailMultiAlternatives(
		"FundFair Email Verification",
		text_content,
		"FundFair",
		[email]
	)
	email.attach_alternative(html_content, 'text/html')
	res = email.send()
	print("EMAIL SENDING RES:", res)
	return True
