# Execute Example Scenario

The scenario shows the transfer of employee to new location in the SAP SuccessFactors system.

## Change Location in SAP SuccessFactors

For an employee in SAP SuccessFactors system, we change the location to for example, (Brisbane, AUS)

1. Log in to the SAP SuccessFactors demo instance with the SAP SuccessFactors Admin user, in this case the admin user is **sfadmin**

2. Search for the employee **Simon Rampal** (srampal) in the Employee Directory.

3. Choose the employee **Simon Rampal**.

4. In the **Employment** section click on the edit.

    ![setup1](./images/setup1.png)

5. Choose the today's date and change location to `Brisbane (8510-0002)`.

    ![setup2](./images/setup2.png)

6. Click on **Save**.

7. In the next popup, you may check the workflow participants and **confirm** the action.

    ![setup3](./images/setup3.png)

8. For the Change event to get triggered, two more Workflow participants has to approve this change. In our demo system, workflow participants are shown as 1. Charles Braun (VP Global People Operations); 2. Tessa Walker (HR Business Partner Global). This means that Charles Braun and Tessa Walker (or Christine Dolan) must approve this request to proceed.

9. You can log in/ask the workflow participants to approve the request. Choose **Proxy Now** and then Select Target User as Charles Braun (cbraun) to approve the request.

    ![setup4](./images/setup4.png)

10. In the Home page of **Charles Braun**, choose approve for **Simon Rampal** reqeusts.

    ![setup5](./images/setup5.png)

11. Choose **Proxy Now** and then Select Target User as **Tessa Walker(twalker)** to approve the request.

12. In the Home page of **Tessa Walker**, choose approve for **Simon Rampal** reqeusts.

## Add Workstation in Facility Manager Application

1. In the command line window check if the app is running:

```
cf apps
```

2. Find the URL for the "FacilityAdmin-router" app - this is the launch URL for the Facility Manager application.

3. Open the URL in a browser.

4. Notice the notification for the employee **Simon Rampal**.

    ![setup6](./images/setup6.png)

5. Go to the details page and maintain the workstation details.

    ![setup7](./images/setup7.png)

6. Play around with the app.



