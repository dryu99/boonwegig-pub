#!/bin/bash

npm install
npm run build

# Restart the scraper service
# sudo systemctl restart event-scraper-service

echo "boon-we-gig scraper deployment complete."