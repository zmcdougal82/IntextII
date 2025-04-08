# Azure Deployment Guide for Movie Recommendation App

This guide will walk you through deploying your Movie Recommendation application to Azure.

## Prerequisites

1. Azure account with active subscription
2. Azure CLI installed (optional but helpful)
3. Git repository setup (already completed)
4. Database migration completed (follow the SQLite to SQL Server Migration Guide)

## Step 1: Deploy the Backend API to Azure App Service

### Option 1: Deploy via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new App Service:
   - Click "Create a resource" > "Web App"
   - Configure basic settings:
     - Resource Group: Same as your SQL Database or create new
     - Name: Choose a unique name (e.g., `movie-recommendation-api`)
     - Publish: Code
     - Runtime stack: .NET 8 (LTS)
     - Operating System: Windows or Linux
     - Region: Same as your SQL Database
   - Choose App Service Plan: B1 is a good starting point
   - Click "Review + create" > "Create"

3. Configure deployment:
   - Go to your new App Service
   - Navigate to "Deployment Center"
   - Select GitHub as source (connect if needed)
   - Choose your repository and the `azure_test_drive` branch
   - Configure build:
     - Runtime stack: .NET
     - Version: 8
     - Startup command: `dotnet MovieRecommendationAPI.dll`
   - Click "Save"

4. Configure application settings:
   - Go to "Configuration" > "Application settings"
   - Add new setting:
     - Name: `ConnectionStrings__DefaultConnection`
     - Value: Your Azure SQL connection string
   - Add any other required settings (e.g., JWT settings)
   - Click "Save"

### Option 2: Deploy via Azure CLI

1. Log in to Azure:
   ```bash
   az login
   ```

2. Create a resource group (if not already created):
   ```bash
   az group create --name MovieRecommendationResourceGroup --location eastus
   ```

3. Create an App Service Plan:
   ```bash
   az appservice plan create --name MovieRecommendationPlan --resource-group MovieRecommendationResourceGroup --sku B1
   ```

4. Create the Web App:
   ```bash
   az webapp create --name movie-recommendation-api --resource-group MovieRecommendationResourceGroup --plan MovieRecommendationPlan --runtime "DOTNET|8.0"
   ```

5. Set up GitHub deployment:
   ```bash
   az webapp deployment source config --name movie-recommendation-api --resource-group MovieRecommendationResourceGroup --repo-url https://github.com/zmcdougal82/IntextII.git --branch azure_test_drive --manual-integration
   ```

6. Configure connection string:
   ```bash
   az webapp config connection-string set --name movie-recommendation-api --resource-group MovieRecommendationResourceGroup --connection-string-type SQLAzure --settings DefaultConnection="YOUR_CONNECTION_STRING"
   ```

## Step 2: Deploy the Frontend to Azure Static Web Apps

### Option 1: Deploy via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Static Web App:
   - Click "Create a resource" > "Static Web App"
   - Configure basic settings:
     - Resource Group: Same as your API
     - Name: Choose a unique name (e.g., `movie-recommendation-app`)
     - Plan type: Free (or Standard for more features)
     - Region: Same as your API
   - Click "Review + create" > "Create"

3. Configure deployment:
   - Select GitHub as source and connect to your repository
   - Choose the `azure_test_drive` branch
   - Configure build settings:
     - App location: `/frontend`
     - API location: (leave blank)
     - Output location: `build`
   - Click "Review + create" > "Create"

4. Configure environment variables:
   - Go to your new Static Web App
   - Navigate to "Configuration"
   - Add application settings:
     - REACT_APP_API_URL: URL of your App Service (API)

### Option 2: Deploy via GitHub Actions

1. Create a GitHub Actions workflow file in your repository:
   - Create `.github/workflows/azure-static-web-apps.yml`
   - Configure for the React frontend
   - Point to the `/frontend` directory

## Step 3: Configure CORS

1. Go to your Azure App Service
2. Navigate to "CORS"
3. Add your Static Web App URL to the allowed origins
4. Click "Save"

## Step 4: Test the Deployed Application

1. Open your Static Web App URL
2. Verify that you can:
   - View the home page
   - Browse movies
   - Register and log in
   - Rate movies
   - Access admin features (if you have admin credentials)

## Step 5: Set Up Custom Domain (Optional)

1. Go to your Static Web App
2. Navigate to "Custom domains"
3. Follow the instructions to configure your domain

## Step 6: Set Up Monitoring and Alerts

1. Go to your App Service
2. Navigate to "Monitoring" > "Metrics"
3. Set up alerts for important metrics like response time and errors

## Troubleshooting

- **HTTP 502 errors**: Check your backend API and make sure it's running
- **Authentication issues**: Verify JWT settings in the backend
- **API connection problems**: Check CORS settings
- **Database connection issues**: Verify connection string and firewall settings

## Cost Management

- App Service B1 plan: ~$14/month
- Azure SQL Database (Basic): ~$5/month
- Static Web App (Free tier): $0/month
- Total estimated cost: ~$19/month (plus any additional services)

You can reduce costs by:
- Using consumption plans for low-traffic applications
- Scaling down during non-peak hours
- Using reserved instances for long-term commitments
