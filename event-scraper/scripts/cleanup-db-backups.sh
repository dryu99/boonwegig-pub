#!/bin/bash

# Get the current date
current_date=$(date +%s)

# Define the number of days to keep backups
days_to_keep=2

# Calculate the cutoff date
cutoff_date=$(date -d "$days_to_keep days ago" +%s)

# Loop through each .sql file in the backups directory
for file in ../supabase/backups/*.sql; do
  # Extract the date from the filename (e.g., 2023-12-03 from data_2023-12-03.sql)
  filename=$(basename "$file")
  file_date_str="${filename##*_}"
  file_date_str="${file_date_str%.sql}"

  # Convert the date to a timestamp
  file_date=$(date -d "$file_date_str" +%s)

  # Compare the file's date to the cutoff date
  if [ "$file_date" -lt "$cutoff_date" ]; then
    echo "Deleting $file"
    rm "$file"
  fi
done