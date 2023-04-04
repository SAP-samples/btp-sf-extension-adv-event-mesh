# Setup BTP and Advanced Event Mesh

## Configure Entitlements for SAP BTP, Cloud Foundry Runtime

> In case that you do not have a subaccount for SAP BTP in place, see sections [Create a Subaccount](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/05280a123d3044ae97457a25b3013918.html?q=subaccount) and [Create Spaces](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/2f6ed22ccf424dae84345f4500c2d8ea.html) in the SAP BTP documentation for more details.

1. Make sure you are logged on to SAP BTP cockpit as a Cloud Foundry administrator.

2. Choose **Entitlements > Entity Assignments**.

3. If there is no entry for the Cloud Foundry runtime, choose **Configure Entitlements**, and then **Add Service Plans**.

4. In the popup, proceed as follows:

- Choose **Cloud Foundry Runtime**.

- Under Available Service Plans, select the **MEMORY** checkbox.

 ![AR](./images/setup13.png)

- Choose **Add 1 Service Plan**.

## Configure Entitlement for SAP Advanced Event Mesh

1. Choose **Configure Entitlements** &rarr; **Add Service Plan**.

2. In the **Subaccount Entitlements** dialog box, select the service **SAP Integration Suite, advanced event mesh**.

 ![AEM Service](./images/setup12.png)

3. In the **Service Details: Advanced Event Mesh** screen area, select the service plan **default**.

4. Choose **Add 1 Service Plan** to add this entitlement for the SAP Advanced Event Mesh service for your subaccount.

5. Choose **Save**.

## Subscribe to Advanced Event Mesh console

1. From the BTP subaccount, choose **Instances and Subscriptions**.

2. Click on **Create** button.

3. In the **New Instance or Subscription** popup choose the following
    - service: **SAP Integration suite, Advanced event mesh**
    - plan: **default**

    ![AEM Service](./images/setup1.png)

4. Choose **Create**.

## Configure Messaging Broker in Advanced Event Mesh Console

1. From the BTP subaccount, choose **Instances and Subscriptions**.

2. Select the tab **Subscriptions**, look for **SAP Integration suite, Advanced event mesh**, Select the three dots ... to open the relevant **Actions**. Select **Go to Application** to open the SAP Integration suite, Advanced event mesh service.

3. Enter your custom Identity Provider credentials to login to the SAP Integration suite, Advanced event mesh Application which opens in a separate browser tab.

4. Choose **Cluster Manager** from left pane and click on **Create Service** button.

5. Enter the following details

    - Service Name: **Facility Manager Messaging**
    - Service Type: **Enterprise**
    - Cloud: Any Cloud Provider
    - Region: Choose suitable cloud region. for example, **EKS - Asia Pacific (Sydney)**
    - Broker Version: Default

6. Choose **Create Service**.

7. Choose **Connect** and copy the connection details from **AMQP** API.

    ![AEM Service2](./images/setup4.png)

   > These details are to be filled in the **Setup Facility Manager application**.

8. Similarly, also copy **SEMP REST API credentials** from **Manage**.

     ![AEM Service3](./images/setup5.png)


    > These details are to be filled in the **Setup Facility Manager application**.

9. Similarly, also copy **REST API** credentials from **Connect**

    ![AEM service4](./images/setup6.png)

    > These details are to be filled in the **Setup Events in Successfactors** [chapter](../setup-events-successfactors/README.md).