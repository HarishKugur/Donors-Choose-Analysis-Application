/** Projects */

/** Donors */


/** Donations */

var Query_Donations1 = "SELECT to_char(donation_recieved_date, 'Month') AS Month_Name,SUM(donation_amount) AS Total " +
"FROM Hksreeka.Donations " +
"GROUP BY to_char(donation_recieved_date, 'Month') "

var Query_Donations2 =  "SELECT to_char(donation_recieved_date, 'Month') AS Month_Name,SUM(donation_amount) AS Total " +
"FROM Hksreeka.Donations " +
"GROUP BY to_char(donation_recieved_date, 'Month') "

/** Resources */



/**Dummy */

var Q1 = "SELECT Donation_Id,Project_Id FROM DONATIONS WHERE ROWNUM < 11"


