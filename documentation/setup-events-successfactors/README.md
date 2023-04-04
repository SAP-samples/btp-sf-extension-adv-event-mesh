# Setup Events in SAP SuccessFactors System

### Create New Integration

1. Login to your SAP SuccessFactors instance with your username and password.

2. Go to **Integration Center** and select **My Integrations**.

3. Click **+ Create** and select **More Integration Types**.

4. In the opened screen, select the following values:

- In the Trigger type area, select the **Intelligent services** radio button

- In the Destination type area select the **REST** radio button

- In the Source Type area select the **SuccessFactors** radio button.

- In the Format area select the **JSON** radio button.

- Choose **Create**.

    ![setup1](./images/setup1.png)

5. In the next screen, choose **Change in Employee Location**.

    ![setup2](./images/setup2.png)

6. Enter a meaningful name for **Integration Name** for example Employee transfer - Brisbane.

7. Choose **Next**.

8. Choose **+ button** to configure fields and then choose **Insert sibling element**

9. Enter the following elements as shown in the screenshot

    ![setup3](./images/setup3.png)

10. Choose each of the element created and in the detailed view of the element, choose the button with tooltip **Set as Association Field**, and map the respective fields

    - name: defaultFullName from User
    - userId: User ID (userId) from Job Information (EmpJob)
    - email: Email (email) from User
    - country: Country (countryOfCompany) from Job Information
    - locationCode: Location (location) from Job Information
    - locationDesc: Name (name) from Location (FOLocation)
    - department: Description (description) from Department (departmentNav/description)
    - jobTitle: Job Title (jobTitle) from Job Information (EmpJob)
    - businessUnit: Description (description) from Business Unit (businessUnitNav/description)
    - reason: set default value **LOC_CHG**

11. Choose **Next** and go to **Destination Settings**

12. In the REST server settings, enter following details

- REST API URL: Paste the public internet URL from connect REST API connection details from Advanced event mesh and append suffix `/Topic/emp/transfer/` , for example `https://<>.solace.cloud:443/Topic/emp/transfer/`
- Authentication Type: Basic Authentication
- UserName: Paste the username from connect REST API connection details from Advanced event mesh
- Password: Paste the password from connect REST API connection details from Advanced event mesh

13. In the **Calculated URI** choose the Calculated URI button

    ![setup4](./images/setup4.png)

14. In the popup choose the field value as `Location (location) from Job Information (EmpJob)`

    ![setup5](./images/setup5.png)

15. Click on **Ok** button

16. Choose **Next**.

17. **Save** the integration

### Setup Intelligent service

1. Search for **Intelligent Service Center (ISC)**.

2. Choose **Change in Employee Location**.

3. In the right side of the screen, choose Custom Activities > Integration.

    ![setup6](./images/setup6.png)

4. There is a popup for selecting Integration. Choose the created Integration and then choose **Add Integration**.

5. Scroll down to the list and select the Integration just you created with source as **Integration Center** and change the **Timing** to **When event is published** from the list.

6. Choose **Actions** (top of page).

7. Choose **Save Flow**.