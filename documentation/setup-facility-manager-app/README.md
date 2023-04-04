# Setup Facility Manager Application

The app allows you to maintain workstation details of the employee. Currently, "Brisbane, AUS" is the default, which can be adapted via `config.js`.

From a technology perspective, the application is written in JavaScript and running on Node.js.

You can either clone the code from GitHub or download and extract the ZIP file provided to your local file system.

## Configure the Application

1. Clone the project:

```
git clone https://github.tools.sap/refapps/btp-extension-sf-advanced-event-mesh.git
```

2. Open `aem.json` file from the cloned project.

3. Fill all the necessary details

```json
{
    "type":"amqp",
    "username":"<To be Filled>",
    "password": "<To be Filled>",
    "url": "<To be Filled>",
    "port": 5671,
    "management":{
        "uri":"<To be Filled>",
        "msgVpnName": "<To be Filled>",
        "username": "<To be Filled>",
        "password": "<To be Filled>"
    }
}
```

- Fill the `username`, `password` and `url` from the AMQP connection details that we copied in [Step 7](../setup-advanced-event-mesh/README.md#configure-messaging-broker-in-advanced-event-mesh-console).

- Fill the management `uri`, `msgVpnName`, `username` and `password` from the SEMP REST API credentials that we copied in [Step 8](../setup-advanced-event-mesh/README.md#configure-messaging-broker-in-advanced-event-mesh-console).

4. Open the `srv/config.js` file and configure the relevant topics.
- Enter the location code to subscribe to the events published from the SAP SuccessFactors for the particular location. For example, to listen to events pusblish from `Brisbane, AUS` set the topic as `emp/transfer/8510-0002`

## Build the Application

> Note: Follow steps 1-4 in the [Deploy Your Multi-Target Application (MTA)](https://developers.sap.com/tutorials/btp-app-cap-mta-deployment.html) tutorial.


1. From the project root directory, build the MTA module:

```
mbt build
```

This creates a `mtar` file `<xxx.mtar>` in the current folder.

## Deploy the Application

1. Open a command line window.

2. Log in to the account and space:

```
cf login -sso
```

  or alternatively log in to the account and space using your SAP BTP credentials:

```
cf login
```

3. Deploy the module to your current Cloud Foundry space:

```
cf deploy <path/to/mtar>
```

4. The deployment can take some minutes. After successful deployment, check if all the services have been created:

```
cf services
```

5. In the deploy log, find the URL of your deployed app.

Example URL: *facilityadmin-router.cfapps.eu10.hana.ondemand.com*

> Using the command `CF apps` you can always look up this information.

6. Open the URL of your deployed UI application in a browser.


