#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 5 ]; then
    echo "Usage: $0 <db_username> <db_hostname> <db_port> <db_name> <backup_file>"
    exit 1
fi

# Assign the arguments to variables
db_username=$1
db_hostname=$2
db_port=$3
db_name=$4
backup_file=$5

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
PGPASSWORD="your_password" dropdb -U $db_username -h $db_hostname -p $db_port --if-exists $db_name

echo "Creating new database..."
PGPASSWORD="your_password" createdb -U $db_username -h $db_hostname -p $db_port $db_name

# Restore the database from the backup file
echo "Restoring database from backup..."
PGPASSWORD="your_password" pg_restore -U $db_username -h $db_hostname -p $db_port -d $db_name -c $backup_file

if [ $? -eq 0 ]; then
    echo "Database restoration completed successfully."
else
    echo "An error occurred during restoration."
fi