const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

async function initialize(query) {
  return new Promise(function (resolve, reject) {

    let connection;
    oracledb.getConnection(
      {
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
      }).then( function (result) {
        connection = result;

        return connection.execute(query);
      }).then (function (queryResult) {
          resolve(queryResult);
        }, function(error) {
          console.log("error", error);
          reject(error);
        }
      ).then(function () {
        if(connection) {
          return connection.close();
        }
      }).catch(function(error) {
        console.log('Connection Not Closed', error);
      });
    });
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.close();
}

module.exports.close = close;



