var express = require('express');
var app = express();
const morgan = require('morgan');
var oracledb = require('oracledb');
var dbpool = require('./dbconnectionPool.js')
var requestParams;


app.use(express.static(__dirname + "/app"));
app.use(morgan("combined"));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

async function startup() {
  try {
    console.log('Initializing database module');
    var query = 'SELECT COUNT(*) FROM RESOURCES'
    await dbpool.initialize(query);
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
}

async function shutdown(e) {
  let err = e;

  console.log('Shutting down');

  try {
    console.log('Closing database module');

    await dbpool.close();
  } catch (err) {
    console.log('Encountered error', e);

    err = err || e;
  }
}

startup();


process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});

app.get('/login', async () => {
  var a = "Donors Choose";
  return a;
});

/** -----------------------------Queries related to Login Page ----------------------------------------*/

app.get('/logindata', async (request, response) => {
  const loginInfo = {
    username: 'Group 20',
    password: 'MyGroup20'
  }
  response.json(loginInfo);
});


app.post('/authenticateLogin', async (request, response) => {

  requestParams = request.query;
  if (requestParams.username === "Group 20" && requestParams.password === "MyGroup20") {
    response.json({ loginStatus: "Success" });
  }
  else {
    response.json({ loginStatus: "Failed" });
  }
});


/**-------------------------- Queries related to Login Page End Here-------------------------------*/


/**-------------------------Query related to Row Count ----------------------------------------*/

app.get('/getRowCount', async (request, response) => {
  var query = "SELECT Q1.donors_count + Q2.projects_count + Q3.resources_count + Q4.schools_count + Q5.teachers_count + Q6.states_count +" +
    "Q7.donations_count FROM" +
    "(SELECT COUNT(*) AS donors_count FROM donors) Q1," +
    "(SELECT COUNT(*) AS projects_count FROM projects) Q2," +
    "(SELECT COUNT(*) AS resources_count FROM resources) Q3, " +
    "(SELECT COUNT(*) AS schools_count FROM schools) Q4," +
    "(SELECT COUNT(*) AS teachers_count FROM teachers) Q5," +
    "(SELECT COUNT(*) AS states_count FROM states) Q6," +
    "(SELECT COUNT(*) AS donations_count FROM donations) Q7"
  const result = await dbpool.initialize(query);
  response.json(result);
});

/**----------Query related to Row Count ---------------------------------------------------------*/


//--------------------Project Routes-------------------

app.get('/getExpiredProjects', async (request, response) => {

  requestParams = request.query;

  var query_chart = "select t1.project_resource_category, count(t1.project_id) as counterr " +
    "from hksreeka.projects t1 " +
    "where t1.project_current_status = 'Expired' and t1.project_resource_category is not null " +
    "group by t1.project_resource_category " +
    "order by counterr desc fetch first 10 rows only "


  const result = await dbpool.initialize(query_chart);
  response.json(result);

});

app.get('/getExpiredProjectsPerState', async (request, response) => {

  requestParams = request.query;

  var query_chart = "select t2.school_state, count(t1.project_id) / (select count(project_id) " +
    "from hksreeka.projects p1 " +
    "join hksreeka.schools p2 " +
    "on p2.school_id = p1.school_id " +
    "where school_state = t2.school_state " +
    "group by p2.school_state) as ratio " +
    "from hksreeka.projects t1 " +
    "join hksreeka.schools t2 " +
    "on t2.school_id = t1.school_id " +
    "where t1.project_current_status = 'Expired' " +
    "group by t2.school_state " +
    "order by ratio desc fetch first 10 rows only "


  const result = await dbpool.initialize(query_chart);
  response.json(result);

});

app.get('/getCorrelationChart', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT * FROM (SELECT Project_Id,CORR(NumOfDays, NumofWords) OVER (ORDER BY Project_Id) AS Cor FROM (SELECT Project_Id, " +
    "CASE WHEN Hksreeka.projects.fully_funded_date - Hksreeka.projects.Project_Posted_Date < 0 THEN " +
    "Hksreeka.projects.fully_funded_date - to_date(to_char(Hksreeka.projects.Project_Posted_Date, 'mm-dd-yy'), 'dd-mm-yy') " +
    "WHEN Hksreeka.projects.fully_funded_date - Hksreeka.projects.Project_Posted_Date >= 0 THEN " +
    "Hksreeka.projects.fully_funded_date - Hksreeka.projects.Project_Posted_Date " +
    "ELSE -1 END AS NumOfDays, " +
    "regexp_count(Hksreeka.projects.project_need_statement, '[^ ]+') AS NumofWords " +
    "FROM Hksreeka.projects " +
    "WHERE Hksreeka.projects.fully_funded_date IS NOT NULL AND Hksreeka.projects.Project_Posted_Date IS NOT NULL) " +
    "ORDER BY Project_Id) " +
    "WHERE ROWNUM<= 5000 AND Cor IS NOT NULL "



  const result = await dbpool.initialize(query_chart);
  response.json(result);

});

app.get('/getDonationDistribution', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT to_char(donation_recieved_date, 'Month') AS Month_Name,round(SUM(donation_amount),0) AS Total " +
    "FROM Hksreeka.Donations " +
    "GROUP BY to_char(donation_recieved_date, 'Month') "


  const result = await dbpool.initialize(query_chart);
  response.json(result);

});

//-----------------------------End of Project Routes----------------------------------------------------


/***---------------------Queries related to Donors ----------------------------------------------- */

app.get('/getPointsOfDonors', async (request, response) => {

  requestParams = request.query;

  var query_table = "SELECT JSON_OBJECT('Donor' IS Donor_ID, 'Level' IS Donor_Level) FROM (SELECT * FROM (SELECT  hksreeka.donors.donor_id AS Donor_ID, " +
    "CASE WHEN hksreeka.donations.donation_amount > (1.2 * Q1.avg) THEN 'Diamond' " +
    "WHEN hksreeka.donations.donation_amount BETWEEN (0.8 * Q1.avg) AND (1.2 * Q1.avg) THEN 'Gold' " +
    "WHEN hksreeka.donations.donation_amount < (0.8 * Q1.avg) THEN 'Silver' " +
    "ELSE 'Unknown' END AS Donor_Level " +
    "FROM hksreeka.donors,hksreeka.donations, " +
    "(SELECT AVG(hksreeka.donations.donation_amount)  as avg FROM hksreeka.donors,hksreeka.donations " +
    "WHERE hksreeka.donors.donor_id=hksreeka.donations.donor_id) Q1) " +
    "WHERE Donor_Level='Diamond' AND ROWNUM<=5 " +
    "UNION ALL " +
    "SELECT * FROM (SELECT  hksreeka.donors.donor_id, " +
    "CASE WHEN hksreeka.donations.donation_amount > (1.2 * Q1.avg) THEN 'Diamond' " +
    "WHEN hksreeka.donations.donation_amount BETWEEN (0.8 * Q1.avg) AND (1.2 * Q1.avg) THEN 'Gold' " +
    "WHEN hksreeka.donations.donation_amount < (0.8 * Q1.avg) THEN 'Silver' " +
    "ELSE 'Unknown' END AS Donor_Level " +
    "FROM hksreeka.donors,hksreeka.donations, " +
    "(SELECT AVG(hksreeka.donations.donation_amount)  as avg FROM hksreeka.donors,hksreeka.donations " +
    "WHERE hksreeka.donors.donor_id=hksreeka.donations.donor_id) Q1) " +
    "WHERE Donor_Level='Gold' AND ROWNUM<=5 " +
    "UNION ALL " +
    "SELECT * FROM (SELECT  hksreeka.donors.donor_id, " +
    "CASE WHEN hksreeka.donations.donation_amount > (1.2 * Q1.avg) THEN 'Diamond' " +
    "WHEN hksreeka.donations.donation_amount BETWEEN (0.8 * Q1.avg) AND (1.2 * Q1.avg) THEN 'Gold' " +
    "WHEN hksreeka.donations.donation_amount < (0.8 * Q1.avg) THEN 'Silver' " +
    "ELSE 'Unknown' END AS Donor_Level " +
    "FROM hksreeka.donors,hksreeka.donations, " +
    "(SELECT AVG(hksreeka.donations.donation_amount)  as avg FROM hksreeka.donors,hksreeka.donations " +
    "WHERE hksreeka.donors.donor_id=hksreeka.donations.donor_id) Q1) " +
    "WHERE Donor_Level='Silver' AND ROWNUM<=5) "


  //var query = requestParams.type === 'table' ? query_table : query_chart;

  const result = await dbpool.initialize(query_table);
  response.json(result);
});

app.get('/getNumOfProjects', async (request, response) => {

  requestParams = request.query;

  var query_times = "SELECT CEIL((((SUM(state.State_Population) * 7.25) - " +
    "SUM(Proj.Project_Cost)) / AVG(Project_Cost)) / COUNT(Proj.Project_ID)/1000) * 1000 " +
    "FROM HKSREEKA.projects Proj,Hksreeka.Schools School,Hksreeka.states state " +
    "WHERE Proj.School_ID = School.School_ID AND School.School_State = State.State_Name "



  //var query = requestParams.type === 'table' ? query_table : query_chart;

  const result = await dbpool.initialize(query_times);
  response.json(result);
});

app.get('/getStateWise', async (request, response) => {

  requestParams = request.query;

  var query_times = "SELECT JSON_OBJECT('State' IS STATE_FOR_SAME, 'TotalAmountForSame' IS TOTAL_AMT_SAME, 'TotalAmountForDifferent' IS TOTAL_AMT_DIFF) " +
    "FROM (SELECT Donor_state AS State_for_same,SUM(Donation_Amount) as TOTAL_AMT_SAME " +
    "FROM (Select Donor_state, Donation_Amount,school_state " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations NATURAL JOIN HKSREEKA.projects NATURAL JOIN HKSREEKA.schools " +
    "WHERE Donor_state=school_state AND Donor_state IN (SELECT Donor_state AS top_10_donors_state " +
    "FROM(SELECT Donor_state ,SUM(Donation_Amount) AS total_amt " +
    "FROM (SELECT Donor_state, Donation_Amount " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations) " +
    "GROUP BY Donor_state " +
    "ORDER BY total_amt DESC) " +
    "WHERE ROWNUM<=10)) " +
    "GROUP BY Donor_state " +
    "ORDER BY TOTAL_AMT_SAME DESC) Q1, " +
    "(SELECT Donor_state AS State_for_diff,SUM(Donation_Amount) as TOTAL_AMT_DIFF " +
    "FROM (Select Donor_state, Donation_Amount,school_state " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations NATURAL JOIN HKSREEKA.projects NATURAL JOIN HKSREEKA.schools " +
    "WHERE Donor_state!=school_state AND Donor_state IN (SELECT Donor_state AS top_10_donors_state " +
    "FROM(SELECT Donor_state ,SUM(Donation_Amount) AS total_amt " +
    "FROM (SELECT Donor_state, Donation_Amount " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations) " +
    "GROUP BY Donor_state " +
    "ORDER BY total_amt DESC) " +
    "WHERE ROWNUM<=10)) " +
    "GROUP BY Donor_state " +
    "ORDER BY TOTAL_AMT_DIFF DESC) Q2 " +
    "WHERE Q1.STATE_FOR_SAME = Q2.STATE_FOR_DIFF "



  //var query = requestParams.type === 'table' ? query_table : query_chart;

  const result = await dbpool.initialize(query_times);
  response.json(result);
});

/***---------------------Queries related to Donors end here ----------------------------------------------- */



/**------------------------------------- Queries related to Donations -------------------------------*/

app.get('/getTop10StatesByDonor', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT Donor_state AS top_10_donors_state,total_num " +
    "FROM(SELECT Donor_state ,COUNT(*) AS total_num " +
    "FROM (SELECT Donor_state, Donation_Amount " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations " +
    "WHERE Donor_state <> 'other') " +
    "GROUP BY Donor_state " +
    "ORDER BY total_num DESC) " +
    "WHERE ROWNUM<=10 "


  var query_table = "SELECT JSON_OBJECT ('Donor' IS donor_id, 'DonorCity' IS donor_city, 'DonorState' IS donor_state," +
    "'DonorIsTeacher' IS donor_is_teacher," +
    "'Zip' IS donor_zip) FROM Donors " +
    "WHERE Donor_is_Teacher='Yes' AND ROWNUM <=10 "

  var query = requestParams.type === 'table' ? query_table : query_chart;

  const result = await dbpool.initialize(query);
  response.json(result);

});


app.get('/getStatesHighestDonations', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT JSON_OBJECT ('State' IS Donor_state, 'Latitude' IS Latitude, 'Longitude' IS Longitude ) " +
    "FROM(SELECT * FROM (SELECT Donor_state ,SUM(Donation_Amount) as don_amt " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations " +
    "GROUP BY Donor_state " +
    "ORDER BY SUM(Donation_Amount) DESC), Hksreeka.States_Location " +
    "WHERE Donor_state=States_Location.State_Name AND ROWNUM<=10) "

  const result = await dbpool.initialize(query_chart);
  response.json(result);

});


app.get('/getStatesHighestDonationsAsTable', async (request, response) => {

  requestParams = request.query;

  var query_table = "SELECT JSON_OBJECT ('State' IS Donor_state,'Amount' IS don_amt) " +
    "FROM(SELECT * FROM (SELECT Donor_state ,SUM(Donation_Amount) as don_amt " +
    "FROM HKSREEKA.donors NATURAL JOIN HKSREEKA.donations " +
    "GROUP BY Donor_state " +
    "ORDER BY SUM(Donation_Amount) DESC), Hksreeka.States_Location " +
    "WHERE Donor_state=States_Location.State_Name AND ROWNUM<=10)"


  const result = await dbpool.initialize(query_table);
  response.json(result);

});


app.get('/getFreeLunchPercentage', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT m1,PER_FOR_0_TO_25,PER_FOR_25_TO_50,PER_FOR_50_TO_75,PER_FOR_75_TO_100 " +
    "FROM (select Month_name as m1,COUNT(*) as PER_FOR_0_TO_25 " +
    "from(select school_freelunchpercentage AS flp,school_name,to_char(donation_recieved_date, 'Month') AS Month_name " +
    "FROM hksreeka.schools natural join HKSREEKA.projects natural join HKSREEKA.donations " +
    "Where school_freelunchpercentage BETWEEN 0 AND 25) " +
    "GROUP BY Month_name), " +
    "(select Month_name as m2,COUNT(*) as PER_FOR_25_TO_50 " +
    "from(select school_freelunchpercentage AS flp,school_name,to_char(donation_recieved_date, 'Month') AS Month_name " +
    "FROM hksreeka.schools natural join HKSREEKA.projects natural join HKSREEKA.donations " +
    "Where school_freelunchpercentage BETWEEN 25 AND 50) " +
    "GROUP BY Month_name), " +
    "(select Month_name as m3,COUNT(*) as PER_FOR_50_TO_75 " +
    "from(select school_freelunchpercentage AS flp,school_name,to_char(donation_recieved_date, 'Month') AS Month_name " +
    "FROM hksreeka.schools natural join HKSREEKA.projects natural join HKSREEKA.donations " +
    "Where school_freelunchpercentage BETWEEN 50 AND 75) " +
    "GROUP BY Month_name), " +
    "(select Month_name as m4,COUNT(*) as PER_FOR_75_TO_100 " +
    "from(select school_freelunchpercentage AS flp,school_name,to_char(donation_recieved_date, 'Month') AS Month_name " +
    "FROM hksreeka.schools natural join HKSREEKA.projects natural join HKSREEKA.donations " +
    "Where school_freelunchpercentage BETWEEN 75 AND 100) " +
    "GROUP BY Month_name) " +
    "WHERE m1=m2 AND m2=m3 AND m3=m4 "


  const result = await dbpool.initialize(query_chart);
  response.json(result);

});


/** ----------------------------Queries related to Donations end here--------------------------------------- */



/*** -------------------------------------Queries related to Resources-------------------------------------------- */


app.get('/getVendorDistributionResources', async (request, response) => {
  requestParams = request.query;

  var query_chart = "select * from(select resource_vendor_name, COUNT(*) as ven_count " +
    "from HKSREEKA.projects natural join HKSREEKA.resources " +
    "WHERE resource_vendor_name IN (Select distinct(resource_vendor_name) from hksreeka.resources) " +
    "group by resource_vendor_name " +
    "ORDER BY ven_count DESC) " +
    "WHERE ROWNUM<=10"

  const result = await dbpool.initialize(query_chart);
  response.json(result);
});

app.get('/getTop5ResourceNames', async (request, response) => {
  requestParams = request.query;

  var query_chart = "select JSON_OBJECT('Technology' IS top_5_tech, 'Books' IS top_5_books,'Supplies' IS top_5_supplies) " +
    "FROM (select top_5_tech,ROWNUM as r_tech " +
    "FROM(select DISTINCT(res) as top_5_tech FROM(select REGEXP_REPLACE(SUBSTR(resource_item_name, 1,instr(resource_item_name,' ',1,2)), '[^a-z]+')as res " +
    "FROM(select resource_item_name " +
    "FROM (select (resource_vendor_name),project_resource_category,resource_item_name " +
    "FROM HKSREEKA.projects natural join HKSREEKA.resources " +
    "where project_resource_category='Technology') " +
    "group by resource_item_name " +
    "order by COUNT(*) DESC)) " +
    "WHERE ROWNUM<=12)), " +
    "(select resource_item_name as top_5_books, ROWNUM as r_books " +
    "FROM(select resource_item_name " +
    "FROM (select resource_vendor_name,project_resource_category,resource_item_name " +
    "FROM HKSREEKA.projects natural join HKSREEKA.resources " +
    "where project_resource_category='Books') " +
    "group by resource_item_name " +
    "order by COUNT(*) DESC) " +
    "WHERE ROWNUM<=5), " +
    "(select REGEXP_REPLACE(resource_item_name, '[^a-zA-Z]+_') as top_5_supplies,ROWNUM as r_supplies " +
    "FROM(select ROWNUM as r, resource_item_name " +
    "FROM(select resource_item_name " +
    "FROM (select resource_vendor_name,project_resource_category,resource_item_name " +
    "FROM HKSREEKA.projects natural join HKSREEKA.resources " +
    "where project_resource_category='Supplies') " +
    "group by resource_item_name " +
    "order by COUNT(*) DESC)) " +
    "WHERE r>2 AND r<8) " +
    "WHERE r_tech=r_books AND r_books=r_supplies"

  const result = await dbpool.initialize(query_chart);
  response.json(result);
});

app.get('/getTopTypeResources', async (request, response) => {
  requestParams = request.query;
  var query_chart = "select project_resource_category, COUNT(*) as res_req " +
    "from HKSREEKA.projects natural join HKSREEKA.resources " +
    "WHERE project_resource_category In (Select distinct(project_resource_category) from hksreeka.projects) " +
    "group by project_resource_category"

  // var query = requestParams.type === 'table' ? query_table : query_chart;
  const result = await dbpool.initialize(query_chart);
  response.json(result);
});

app.get('/getTopPriceResources', async (request, response) => {
  requestParams = request.query;

  var query_chart = "select range_bet_0_to_50,range_bet_50_to_100,range_bet_100_to_500,range_bet_500_to_1000,range_bet_1000_to_8000,range_bet_8000_to_15000 " +
    "FROM(select COUNT(*) as range_bet_0_to_50 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 0 AND 50)), " +
    "(select COUNT(*) range_bet_50_to_100 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 50 AND 100)), " +
    "(select COUNT(*) range_bet_100_to_500 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 100 AND 500)), " +
    "(select COUNT(*) range_bet_500_to_1000 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 500 AND 1000)), " +
    "(select COUNT(*) range_bet_1000_to_8000 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 1000 AND 8000)), " +
    "(select COUNT(*) range_bet_8000_to_15000 " +
    "FROM(select DISTINCT(resource_unit_price) " +
    "from hksreeka.resources " +
    "WHERE resource_unit_price BETWEEN 8000 AND 15000))"

  const result = await dbpool.initialize(query_chart);
  response.json(result);
});


app.get('/getTop10SuppliesResources', async (request, response) => {
  requestParams = request.query;

  var query_chart = "SELECT Q1.top_10_states_for_supplies,Q2.num_of_rural_schools,Q3.num_of_suburban_schools,Q4.num_of_urban_schools FROM " +
    "(SELECT school_state AS top_10_states_for_supplies " +
    "FROM(SELECT school_state " +
    "FROM(SELECT school_state,COUNT(*) as num_of_resources_in_states_for_Supplies " +
    "FROM(Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE project_resource_category='Supplies') " +
    "GROUP BY school_state) " +
    "ORDER BY num_of_resources_in_states_for_Supplies DESC) " +
    "WHERE ROWNUM<=10) Q1, " +
    "(Select school_state,COUNT(*) AS num_of_rural_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='rural' AND project_resource_category='Supplies') " +
    "GROUP BY school_state) Q2, " +
    "(Select school_state,COUNT(*) AS num_of_suburban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='suburban' AND project_resource_category='Supplies') " +
    "GROUP BY school_state) Q3, " +
    "(Select school_state,COUNT(*) AS num_of_urban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='urban' AND project_resource_category='Supplies') " +
    "GROUP BY school_state) Q4 " +
    "WHERE Q1.top_10_states_for_supplies=Q2.school_state AND Q2.school_state=Q3.school_state AND Q3.school_state=Q4.school_state"


  const result = await dbpool.initialize(query_chart);
  response.json(result);
});

app.get('/getTop10BookResources', async (request, response) => {
  requestParams = request.query;


  var query_chart = "SELECT Q1.top_10_states_for_Books,Q2.num_of_rural_schools,Q3.num_of_suburban_schools,Q4.num_of_urban_schools FROM " +
    "(SELECT school_state AS top_10_states_for_Books " +
    "FROM(SELECT school_state " +
    "FROM(SELECT school_state,COUNT(*) as num_of_resources_in_states_for_Books " +
    "FROM(Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE project_resource_category='Books') " +
    "GROUP BY school_state) " +
    "ORDER BY num_of_resources_in_states_for_Books DESC) " +
    "WHERE ROWNUM<=10) Q1, " +
    "(Select school_state,COUNT(*) AS num_of_rural_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='rural' AND project_resource_category='Books') " +
    "GROUP BY school_state) Q2, " +
    "(Select school_state,COUNT(*) AS num_of_suburban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='suburban' AND project_resource_category='Books') " +
    "GROUP BY school_state) Q3, " +
    "(Select school_state,COUNT(*) AS num_of_urban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='urban' AND project_resource_category='Books') " +
    "GROUP BY school_state) Q4 " +
    "WHERE Q1.top_10_states_for_Books=Q2.school_state AND Q2.school_state=Q3.school_state AND Q3.school_state=Q4.school_state"


  const result = await dbpool.initialize(query_chart);
  response.json(result);
});

app.get('/getTop10TechResources', async (request, response) => {

  requestParams = request.query;

  var query_chart = "SELECT Q1.top_10_states_for_tech ,Q2.num_of_rural_schools ,Q3.num_of_suburban_schools ,Q4.num_of_urban_schools FROM " +
    "(SELECT school_state AS top_10_states_for_tech " +
    "FROM(SELECT school_state " +
    "FROM(SELECT school_state,COUNT(*) as num_of_resources_in_states_for_technology " +
    "FROM(Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE project_resource_category='Technology') " +
    "GROUP BY school_state) " +
    "ORDER BY num_of_resources_in_states_for_technology DESC) " +
    "WHERE ROWNUM<=11) Q1, " +
    "(Select school_state,COUNT(*) AS num_of_rural_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='rural' AND project_resource_category='Technology') " +
    "GROUP BY school_state) Q2, " +
    "(Select school_state,COUNT(*) AS num_of_suburban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='suburban' AND project_resource_category='Technology') " +
    "GROUP BY school_state) Q3, " +
    "(Select school_state,COUNT(*) AS num_of_urban_schools " +
    "FROM (Select DISTINCT(hksreeka.schools.school_name),hksreeka.projects.project_resource_category,metro_type,school_city,school_state " +
    "FROM HKSREEKA.resources Natural join HKSREEKA.projects Natural join HKSREEKA.schools " +
    "WHERE metro_type='urban' AND project_resource_category='Technology') " +
    "GROUP BY school_state) Q4 " +
    "WHERE Q1.top_10_states_for_tech=Q2.school_state AND Q2.school_state=Q3.school_state AND Q3.school_state=Q4.school_state "


  const result = await dbpool.initialize(query_chart);
  response.json(result);

});

/*** -------------------------------------Queries related to Resources End Here-------------------------------------------- */


app.listen(3000);
console.log("Server running on port 3000");


