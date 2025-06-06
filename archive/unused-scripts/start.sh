#!/bin/bash

# Start the server and client concurrently
concurrently "node server/index.js" "cd client && vite"