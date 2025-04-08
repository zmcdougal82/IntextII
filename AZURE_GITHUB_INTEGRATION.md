# Azure and GitHub Integration Guide

This guide will help you set up continuous integration and deployment (CI/CD) between your GitHub repository and Azure resources for both the frontend and backend applications.

## Prerequisites

1. GitHub repository with your code pushed to it
2. Azure account with deployed resources (App Service and Static Web App)
3. Administrator access to both GitHub and Azure

## Backend CI/CD Setup

The backend CI/CD workflow will build and deploy your .NET API to Azure App Service whenever changes are pushed to the `azure_test_drive` branch.

### Step 1: Get Azure Publish Profile

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service (movie-recomm-api-2024)
3. In the left menu, click on "Get publish profile"
4. Save the downloaded file (it contains XML with deployment credentials)

### Step 2: Add Publish Profile as GitHub Secret

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click on "New repository secret"
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire content of the publish profile XML file
6. Click "Add secret"

## Frontend CI/CD Setup

The frontend CI/CD workflow will build your React app and deploy it to Azure Static Web App whenever changes are pushed to the `azure_test_drive` branch.

### Step 1: Get Static Web App Deployment Token

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App (movie-recommendation-frontend)
3. In the left menu, click on "Overview"
4. Click on "Manage deployment token"
5. Copy the deployment token

### Step 2: Add Token as GitHub Secret

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click on "New repository secret"
4. Name: `AZURE_STATIC_WEB_APP_TOKEN`
5. Value: Paste the deployment token
6. Click "Add secret"

## How CI/CD Works

Once set up, here's how the CI/CD process works:

1. You make changes to your code
2. You push your changes to the `azure_test_drive` branch on GitHub
3. GitHub Actions will automatically:
   - Build your application
   - Run tests (if configured)
   - Deploy to Azure

### Backend Changes

When you make changes to files in the `backend/` directory and push to the `azure_test_drive` branch, GitHub Actions will:

1. Restore dependencies
2. Build the .NET project
3. Publish the application
4. Deploy to Azure App Service

### Frontend Changes

When you make changes to files in the `frontend/` directory and push to the `azure_test_drive` branch, GitHub Actions will:

1. Install dependencies
2. Build the React app
3. Deploy to Azure Static Web App

## Troubleshooting

If deployments fail, you can view the logs in the GitHub Actions tab of your repository. Common issues include:

- **Invalid secrets**: Double-check your `AZURE_WEBAPP_PUBLISH_PROFILE` and `AZURE_STATIC_WEB_APP_TOKEN` values
- **Build errors**: Fix any compilation or dependency issues in your code
- **Permission issues**: Ensure your Azure service principals have the correct permissions

## Manual Deployments

You can still deploy manually if needed:

### Backend

```bash
cd backend
dotnet publish -c Release
az webapp deployment source config-zip --resource-group MovieRecommendationRG --name movie-recomm-api-2024 --src ./publish.zip
```

### Frontend

```bash
cd frontend
npm run build
az staticwebapp deploy --source-location ./build --app-name movie-recommendation-frontend --resource-group MovieRecommendationRG
```

## Monitoring Deployments

1. GitHub Actions: Check the "Actions" tab in your GitHub repository
2. Azure App Service: Check the "Deployment Center" in your App Service resource
3. Azure Static Web App: Check the "Deployment history" in your Static Web App resource
