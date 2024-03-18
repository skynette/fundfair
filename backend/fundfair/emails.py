from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from zcore.settings import EMAIL_HOST_USER

from_email = EMAIL_HOST_USER


def send_email():
	context = {
	}
	html_content = render_to_string("email_code.html", context)
	text_content = strip_tags(html_content)
	email = EmailMultiAlternatives(
		"subject,",
		text_content,
		"FundFair",
		["receipent"]
	)
	email.attach_alternative(html_content, 'text/html')
	email.send()
	return True