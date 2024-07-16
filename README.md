# SPReact Framework Extension

SPREACT allows ReactJS app developers to create ReactJS apps and deploy it on the SharePoint without using SPFX.

**PLEASE DONT USE IT IN PRODUCTION ENVIRONMENT AS THE CONCEPT IS STILL IN EVALUATION PHASE**

SPFX is the most lovely way to create SharePoint App.
However technically speaking ReactJS app or any JavaScript UI framework is static client side single page app. This means that we should able to host the ReactJS app inside SharePoint folder and should be able to render it.

This project creates possibility to develop that ReactJS app and deploy it on App catelog.

The SPFX developers would be able to create a SPREACT app with same skillset like NODEJS, NPM, Typescript etc.

**Requirements:**

>     SharePoint Online Only
>     Node >= 16.20.1

The following are steps to create SPREACT app.

STEP 1: Create React Application

 First we would create react application using cra using below command:

  **npx create-react-app todo-app --template typescript**

 Optionally we would install Material UI /MUI (optional)
 

    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

STEP 2 : Install Application Packer Node Module 

Go to command prompt of application and run the below command:

      npm install spreact-app-package

  
 Then goto package.json file of project and add the below line under "**scripts**"

    pack-app" : "spreact-app-package

STEP 3 : Add application package file
  
Run the below command in application commmand prompt to add app-package.json file

  **npx create-spreact-app --init**

Update app-package.json file under **config** folder like name of the application, description etc. The below is important values

  *name*: Name of the application
  *id*: Application GUID (autogenerated)
  *version*: Application version number. (You should increament version number in every new build manually)
  *description* : Description of application
  *publisher* : You company name
  *sharepointHost* : Name of SharePoint tanent, for example contoso if SharePoint tanent is https://contoso.sharepoint.com
  *appPackagename*: Name of the application package file that will be generated by app pack node module. Note file extension should be **appkg** only.

SETP 5: Build you application
Run the following command to build you application:
  

      npm run build

STEP 6: Create application package
Use the below command to create application package:

      npm run pack-app

This will generate application package file (.appkg file) in deploy folder of project

**| Deployment |**

SETP 7: Create CDN *(One time only)*

In order to deploy your SPREACT application, you first need to create CDN using below steps:

  a. Browse to SharePoint root site (for example, https://contoso.sharepoint.com) and create Document library called "ClientSideApps"

  b. It is very imporatnt to change title of the document library to "Client Side Apps". So that internal name should be "ClientSideApps"  and title should be "Client Side Apps".

  c. Hide this document libaray using Powershell PnPPowerShell using following command:

    Connect-PnPOnline https://contoso.sharepoint.com -Interactive
    Set-PnPList -Identity "Client Side Apps" -Hidden $true

  d. Create Public CDN Using SharePoint Management Shell

    Connect-SPOService -Url https://contoso-admin.sharepoint.com
    Set-SPOTenantCdnEnabled -CdnType Public
    Add-SPOTenantCdnOrigin -CdnType Public -OriginUrl ClientSideApps
    Get-SPOTenantCdnOrigins -CdnType Public

    (your apps will be installed on the public CDN path https://publiccdn.sharepointonline.com/contoso.sharepoint.com/ClientSideApps)

STEP 8: Create SPREACT App Catalog (One time only)
Download App Catalog application (SharePoint Extension) from the below url and upload to your SharePoint tanent app catalog.
This will add application Catalog for SPREACT apps on the APP Catalog Site. You can also install app catalog to Site level app catalog.
  Note: Do not install for all site collection, its not required.

  https://github.com/irfotechnology/SPReact/blob/main/release/spreact-app-catalog.sppkg

Also, you need to download the app launcher (SharePoint Extension) and upload to your SharePoint tanent app catalog.
  Note: Do not install for all site collection, its not required.

  https://github.com/irfotechnology/SPReact/blob/main/release/spreact-app-launcher.sppkg

STEP 9: Deploy your app package (.appkg file)
Upload your appkg file in the newly create app catalog (SPREACT App Catalog). You should specify the target SharePoint site collection where you want to install your SPReact app.

STEP 10: Add your SPReact app on your Sharepoint site
Goto your target SharePoint site and add 'SPREACT App launcher' app and go to home page of the site collection and refresh it.
  It should show your SPREACT application

**| WORKBENCH |**

While doing development you may want to run your SPREACT app inside SharePoint site. To do so, run your SPREACT app using the below command:

  **npm start**

Goto your sharepoint development site and install 'SPREACT App launcher' app and use the url paramter in the link to render your site.
For example: 

>   https://contoso.SharePoint.com/Sites/Dev?Workbench=true


**| Unload App |**

When SPREACT app runs, it hides SharePoint component. But sometimes we would like to go to SharePoint site content etc.
For easy site navigation, use Skip url paramter to show sharepoint site instead of app. For example:

>   https://contoso.SharePoint.com/Sites/Dev?Skip=true

**| Workflow |**

```mermaid
graph LR
A(ReactJS App) -- Deployment--> B[SPReact App Catalog] 
A --> C((SPReact App))
B --> D[(SharePoint Public CDN)]
C -- SharePoint Site --> D