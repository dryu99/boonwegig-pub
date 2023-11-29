#!/bin/bash

# Prompt user for input
read -p "Enter database username: " db_username
read -p "Enter database hostname (default: localhost): " db_hostname
read -p "Enter database port (default: 5432): " db_port
read -p "Enter the name of the database to restore: " db_name
read -p "Enter the path to the backup file: " backup_file

# Set default values if empty
db_hostname=${db_hostname:-localhost}
db_port=${db_port:-5432}

# Check if the backup file exists
if [ ! -f "$backup_file" ]; then
    echo "Backup file not found: $backup_file"
    exit 1
fi

# Confirmation
echo "This script will restore the database '$db_name' from the file '$backup_file'."
read -p "Are you sure you want to proceed? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Restoration cancelled."
    exit 1
fi

# Drop and recreate the database
echo "Dropping existing database (if it exists)..."
dropdb -U $db_username -h $db_hostname -p $db_port --if-exists $db_name

echo "Creating new database..."
createdb -U $db_username -h $db_hostname -p $db_port $db_name

# Restore the database from the backup file
echo "Restoring database from backup..."
pg_restore -U $db_username -h $db_hostname -p $db_port -d $db_name -c $backup_file

if [ $? -eq 0 ]; then
    echo "Database restoration completed successfully."
else
    echo "An error occurred during restoration."
fi