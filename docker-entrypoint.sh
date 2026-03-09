#!/bin/sh
# Generate config.json from environment variables at container startup

CONFIG_PATH="/usr/share/nginx/html/assets/config.json"

# Only generate if env vars are set; otherwise use the baked-in config.json
if [ -n "$GOOGLE_CLIENT_ID" ]; then
  # Convert comma-separated calendar IDs to JSON array
  CALENDAR_JSON=$(echo "$GOOGLE_CALENDAR_IDS" | sed 's/,/","/g')

  cat > "$CONFIG_PATH" <<EOF
{
  "googleClientId": "${GOOGLE_CLIENT_ID}",
  "googleApiKey": "${GOOGLE_API_KEY}",
  "googleCalendarIds": ["${CALENDAR_JSON}"]
}
EOF
fi

exec "$@"
