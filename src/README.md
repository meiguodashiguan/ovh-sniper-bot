
# OVH Server Sniper

This application monitors OVH server availability and can automatically purchase servers when they become available.

## Features

- Monitor OVH server availability by plan code
- Receive Telegram notifications when servers become available
- Auto-checkout option to purchase servers automatically
- Configurable check intervals
- Real-time monitoring status dashboard

## Setup

### Prerequisites

1. OVH API credentials (App Key, App Secret, Consumer Key)
2. Telegram Bot Token and Chat ID for notifications
3. Knowledge of the OVH server plan code you want to monitor

### OVH API Credentials

To get OVH API credentials:

1. Go to https://api.ovh.com/createApp/
2. Create an application to get your Application Key and Application Secret
3. Generate a Consumer Key with the necessary access rights

### Usage

1. Fill in the configuration form with your API credentials
2. Set your server preferences (plan code, OS, duration, etc.)
3. Start monitoring
4. When a server becomes available, you'll receive a Telegram notification
5. If auto-checkout is enabled, the application will attempt to purchase the server automatically

## Important Notes

- This is a frontend application that makes API requests to OVH. Your API credentials are only stored in browser memory and are sent securely to the backend.
- For security reasons, the application does not store your OVH API credentials between sessions.
- Set a reasonable check interval (recommended: 60 seconds or more) to avoid API rate limits.

## Disclaimer

This application is for educational purposes only. Please use responsibly and in accordance with OVH's terms of service.
