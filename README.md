# Donors-Choose-Analysis-Application

A full Stack Web application built using AngularJS, Node.js, Express, Oracle Database, JavaScript, HTML, CSS, BootStrap and Chart.js

DonorsChoose.org is a platform, where donations for the schools can be done. It is a single place, at which Donors and Receivers (schools) are connected.
Our Application, analyses the data of Donors, Projects, Donations, Schools requested for Donations and their requirements. We predict the trends based on the data Available from Kaggle.
Our trends can be extended easily on the updated dataset too to predict the latest trends.

Our Application - DonorChoosePredict has 4 main categories i.e. Donors, Resources, Projects and Donations.
In each category, we analyse the dataset and predict the trends that would help the DonorsChoose.org in Promoting themselves by focusing on the Donors / States, from where lot of donations have been received.

Example trends :
1. Donors who have donated the most consistently
2. States from which more donations have been received
3. The projects that have been donated the most
4. The most requested resources based on the school location whether urban, suburban or rural

There are in total 15 trends spanned across the categories and available in server.js

Data:

The data set has been taken from : 
https://www.kaggle.com/donorschoose/io#Resources.csv


How to run the application:

1. Create a connection between Oracle DB and Node:
Refer : https://blogs.oracle.com/opal/introducing-node-oracledb-a-nodejs-driver-for-oracle-database

Clone the source code into local machine
2. Connection between BackEnd and FrontEnd of the application:

    Set up a server on localhost - node server.js

3. Install dependencies for Front End of the application :
    npm install - installs all the dependencies

   npm start - to run the application

The architecture followed is : Server is set up separately for backend and frontend part of the application on different port numbers of the localhost. On demand, API calls are made from UI to Backend Services.



