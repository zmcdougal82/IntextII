# SQLite to Azure SQL Server Migration Guide

This guide provides step-by-step instructions for migrating your Movie Recommendation application database from SQLite to Azure SQL Server.

## Prerequisites

1. An Azure account with permission to create resources
2. .NET SDK 8.0 or later installed
3. Azure Data Studio or SQL Server Management Studio (SSMS) installed (optional but helpful)

## Step 1: Create an Azure SQL Database

1. Log in to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" > "Databases" > "SQL Database"
3. Fill in the basics:
   - Subscription: Your subscription
   - Resource group: Create new or use existing
   - Database name: `MovieRecommendationDB`
4. Create a new server or use an existing one
   - Server name: Must be globally unique (e.g., `yourmovieapp-server`)
   - Location: Choose the region closest to your users
   - Authentication method: Use SQL authentication
   - Admin username: Create a secure admin username
   - Password: Create a strong password (save these credentials!)
5. Configure compute + storage:
   - Service tier: Basic or Standard (depending on your needs/budget)
6. Click "Review + create" and then "Create"

## Step 2: Update Connection String

1. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR-SERVER.database.windows.net;Database=MovieRecommendationDB;User Id=YOUR-USERNAME;Password=YOUR-PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true"
   }
   ```
   
   Replace:
   - `YOUR-SERVER` with your Azure SQL server name
   - `YOUR-USERNAME` with your SQL admin username
   - `YOUR-PASSWORD` with your SQL admin password

## Step 3: Create Database Schema in Azure SQL

1. Open Azure Data Studio or SQL Server Management Studio
2. Connect to your Azure SQL Server using the credentials from Step 1
3. Open and execute the `CreateDatabaseSchema.sql` script

## Step 4: Export Data from SQLite

1. Build and run the data export tool:
   ```bash
   cd backend/SqlServerMigration
   dotnet build
   dotnet run
   ```

2. This will generate SQL scripts in the `SqlServerMigration/Output` directory:
   - `01_Movies.sql` - Insert statements for movies
   - `02_Users.sql` - Insert statements for users
   - `03_Ratings.sql` - Insert statements for ratings

## Step 5: Import Data to Azure SQL

1. Open Azure Data Studio or SQL Server Management Studio
2. Connect to your Azure SQL Database
3. Execute the SQL scripts in this order:
   - `01_Movies.sql`
   - `02_Users.sql`
   - `03_Ratings.sql`

## Step 6: Update Application Code

1. Program.cs has already been updated to use SQL Server instead of SQLite
2. Deploy your application to Azure (Azure App Service recommended)

## Step 7: Test the Application

1. Verify login functionality
2. Check that movies are displayed correctly
3. Ensure ratings can be created and retrieved
4. Test all admin features

## Troubleshooting

- **Connection issues**: Verify your firewall settings in Azure to allow your application to connect
- **Migration errors**: Check the data types in the schema if you encounter import errors
- **Performance issues**: Consider adding indexes for frequently queried columns
- **Authentication issues**: Ensure your connection string is correctly configured

## Securing Your Connection String

For production, consider using Azure Key Vault to store and retrieve your database connection string securely:

1. Create a Key Vault in Azure
2. Add your connection string as a secret
3. Update your application to retrieve the connection string from Key Vault
