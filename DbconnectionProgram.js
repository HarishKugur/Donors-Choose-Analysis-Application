var oracledb = require('oracledb');
oracledb.getConnection(
  {
    user          : "",
    password      : "",
    connectString : "//oracle.cise.ufl.edu/orcl"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "SELECT * FROM Employees",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });