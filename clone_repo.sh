#!/bin/bash
set -e

echo "Cloning anime3 repository..."
git clone https://github.com/Gaminglover99/anime3.git temp_repo

echo "Moving files to root directory..."
rsync -av temp_repo/ ./ --exclude='.git'

echo "Removing temporary repository..."
rm -rf temp_repo

echo "Installing node dependencies..."
npm install

echo "Setting up the database..."
npm run db:push

echo "Setup complete!"