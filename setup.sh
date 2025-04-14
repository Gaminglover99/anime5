#!/bin/bash
set -e

echo "Setting up environment..."

# Reset admin user for easy login
echo "Resetting admin user..."
npx tsx scripts/reset-admin.ts

# Create minimal data for testing
echo "Adding initial data for testing..."
npx tsx scripts/seed-minimal.ts

echo "Setup complete! Starting development server..."