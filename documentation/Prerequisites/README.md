# Prerequisites

This section contains the prerequisites that you would have to get started. It’s likely that you have some of the software already installed, so you can just skip those steps.

## Systems and Accounts

* [SAP SuccessFactors](https://help.sap.com/docs/SAP_SUCCESSFACTORS_HXM_SUITE) system
* [Enterprise global account](https://help.sap.com/products/BTP/65de2977205c403bbc107264b8eccf4b/8ed4a705efa0431b910056c0acdbf377.html?locale=en-US#loioc165d95ee700407eb181770901caec94) in SAP BTP with SAP BTP, Cloud Foundry enrivonment enabled. Trial accounts in SAP BTP are not supported.

## For Local Development

* [Node.js](https://nodejs.org/en/download/) - find the latest Node.js version.
* [Cloud Foundry Command Line Interface (cf CLI)](https://github.com/cloudfoundry/cli#downloads)
* [Visual Studio Code](https://code.visualstudio.com/download) or another suitable IDE or editor of your choice

## On SAP BTP Side

* [Subaccount](https://help.sap.com/docs/btp/sap-business-technology-platform/account-model) in SAP BTP
* [Cloud Foundry Space](https://help.sap.com/docs/btp/sap-business-technology-platform/create-spaces) in SAP BTP


### Services in SAP BTP and Entitlements

The application requires the following set of SAP BTP [Entitlements and Quotas](https://help.sap.com/products/BTP/65de2977205c403bbc107264b8eccf4b/00aa2c23479d42568b18882b1ca90d79.html?locale=en-US):

| Service                           | Plan       | Number of Instances |
|-----------------------------------|------------|:-------------------:|
| SAP Integration Suite, advanced event mesh| default    |          1          |
| SAP HANA Schemas & HDI Containers | hdi-shared |          1          |
| SAP HANA Cloud                    | hana       |          1          |
| Cloud Foundry Runtime             | MEMORY     |          1          |


Optional Subscriptions:

| Service                           | Plan       | Number of Instances |
|-----------------------------------|------------|:-------------------:|
|SAP Business Application Studio	|standard    |         1           |


[SAP Business Application Studio](https://help.sap.com/products/SAP%20Business%20Application%20Studio?locale=en-US&version=Cloud) offers a modern development environment tailored for efficient development of business applications for the SAP Intelligent Enterprise.

## On SAP HANA Cloud Side

Make sure that you have an instance of SAP HANA database in your space. For more details, see section [Create an SAP HANA Database Instance Using SAP HANA Cloud Central](https://help.sap.com/docs/HANA_CLOUD/9ae9104a46f74a6583ce5182e7fb20cb/92c59db648b940f48105d62a34f099fc.html) in the SAP HANA Cloud documentation.

## On SAP SuccessFactors Side

- You have a dedicated SAP SuccessFactors company instance
- To configure the integration on the SAP SuccessFactors system side, you need a user with administrator permissions
