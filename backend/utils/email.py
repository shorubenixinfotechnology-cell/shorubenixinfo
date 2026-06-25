import smtplib
import secrets
import string
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.settings import settings

logger = logging.getLogger(__name__)

def generate_otp() -> str:
    """Generate a secure 6-digit numeric OTP."""
    # Use secrets for cryptographically secure random numbers
    return "".join(secrets.choice(string.digits) for _ in range(6))

def send_otp_email(to_email: str, otp: str, purpose: str = "login") -> bool:
    """Send an OTP email to the user."""
    if not settings.SMTP_PASSWORD or settings.SMTP_PASSWORD == "YOUR_GMAIL_APP_PASSWORD_HERE":
        logger.warning("SMTP_PASSWORD is not configured. Email will not be sent.")
        logger.info(f"Generated OTP for {to_email} ({purpose}): {otp}")
        return False

    subject = ""
    purpose_text = ""
    if purpose == "login":
        subject = "Shorubenix Infotech - Your Login Verification Code"
        purpose_text = "verify your login request"
    elif purpose == "reset_password":
        subject = "Shorubenix Infotech - Your Password Reset Verification Code"
        purpose_text = "reset your password"
    else:
        subject = "Shorubenix Infotech - Verification Code"
        purpose_text = "verify your request"

    # HTML Body Design
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f3f4f6;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                border: 1px solid #e5e7eb;
            }}
            .header {{
                background: linear-gradient(135deg, #0ea5e9, #2563eb);
                padding: 30px;
                text-align: center;
                color: #ffffff;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }}
            .content {{
                padding: 40px 30px;
                color: #374151;
                line-height: 1.6;
            }}
            .otp-box {{
                background-color: #f0f9ff;
                border: 2px dashed #0ea5e9;
                border-radius: 12px;
                text-align: center;
                padding: 20px;
                margin: 30px 0;
            }}
            .otp-code {{
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 6px;
                color: #2563eb;
                margin: 0;
            }}
            .footer {{
                background-color: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
                border-top: 1px solid #e5e7eb;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Shorubenix Info Technology</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to <strong>{purpose_text}</strong>. Please use the following 6-digit One-Time Password (OTP) to proceed:</p>
                <div class="otp-box">
                    <p class="otp-code">{otp}</p>
                </div>
                <p style="color: #ef4444; font-size: 14px; font-weight: 600;">This verification code is valid for 5 minutes. Do not share this OTP with anyone.</p>
                <p>If you did not make this request, you can safely ignore this email.</p>
                <p>Best regards,<br><strong>Shorubenix Support Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Shorubenix Info Technology. All rights reserved.</p>
                <p>shorubenixinfotechnology@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.SMTP_EMAIL
    message["To"] = to_email

    # Add HTML and Plaintext body
    plain_text = f"Hello,\n\nYour Shorubenix verification code is: {otp}\n\nThis code is valid for 5 minutes.\n\nBest regards,\nShorubenix Support Team"
    message.attach(MIMEText(plain_text, "plain"))
    message.attach(MIMEText(html_content, "html"))

    try:
        # Connect to SMTP
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_EMAIL, to_email, message.as_string())
        server.quit()
        logger.info(f"Successfully sent OTP email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {to_email}: {e}")
        return False
