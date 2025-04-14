#!/bin/bash

# Script to clone a GitHub repository directly into the current directory

# Display a message explaining what the script will do
echo "Cloning the anime1 repository (https://github.com/Gaminglover99/anime1.git) directly into the current directory."
echo "This operation will copy all files from the repository without creating additional folders."

# Create a temporary directory to clone the repository
temp_dir=$(mktemp -d)
echo "Creating temporary directory: $temp_dir"

# Clone the repository into the temporary directory
echo "Cloning repository into temporary directory..."
git clone https://github.com/Gaminglover99/anime1.git "$temp_dir"

if [ $? -ne 0 ]; then
    echo "Error: Failed to clone the repository."
    echo "Please check the repository URL and your internet connection."
    # Clean up temporary directory
    rm -rf "$temp_dir"
    exit 1
fi

# Move all files (including hidden ones) from the temporary directory to the current directory
echo "Moving files to current directory..."
mv "$temp_dir"/* "$temp_dir"/.* . 2>/dev/null

# The above command might show errors for . and .. directories, which is normal
# Check if the move operation was successful
if [ $? -ne 0 ] && [ $? -ne 1 ]; then
    echo "Error: Failed to move files from temporary directory."
    # Clean up temporary directory
    rm -rf "$temp_dir"
    exit 1
fi

# Remove the temporary directory
echo "Cleaning up temporary directory..."
rm -rf "$temp_dir"

echo "Repository has been successfully cloned into the current directory."
echo "All files and their original structure have been preserved."
echo "No additional folders have been created."

# Instructions for next steps
echo "To use the cloned repository, you can now examine the files and directories"
echo "that have been added to the current project."

exit 0
