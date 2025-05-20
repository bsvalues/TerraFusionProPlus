#!/bin/bash

# Start both the server and client using concurrently
npx concurrently \
  "node server/index.js" \
  "cd client && npx vite --port 5000 --host 0.0.0.0"