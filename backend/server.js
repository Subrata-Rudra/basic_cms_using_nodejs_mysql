const express = require("express");
const cors = require("cors");
const { connection, connectDb } = require("./config/db");
const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

connectDb();

// Test server
app.get("/test", (req, res) => {
  res.json({ Message: "CMS backend is running✅", Runing_Port: port });
});

// Get all table names from database
app.get("/getAllTables", (req, res) => {
  const getTablesQuery = "show tables;";
  try {
    connection.query(getTablesQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      const tables = [];
      for (let i = 0; i < result.length; i++) {
        tables.push(result[i]["Tables_in_vahan_cms"].slice(0, -1));
      }
      res.status(200).send(tables);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in getting all table names due to internal server error"
      );
  }
});

// Create new table
app.post("/createTable", (req, res) => {
  const { name, attributes } = req.body;
  try {
    const checkTableExistQuery = `SELECT * FROM information_schema.tables WHERE table_schema = "${
      process.env.DATABASE_NAME
    }" AND table_name = "${name.toLowerCase()}s" LIMIT 1;`;
    connection.query(checkTableExistQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      if (result.length > 0) {
        return res.status(200).send("Table already exists❌");
      }
      var createTableQuery = `CREATE TABLE ${
        name.toLowerCase() + "s"
      } (id INT AUTO_INCREMENT PRIMARY KEY, `;
      let uniqueColumns = [];
      for (let i = 0; i < attributes.length; i++) {
        let arr = attributes[i].split("|=|");
        createTableQuery += arr[0] + " " + arr[1];
        if (arr.length === 3) {
          if (arr[2] === "n") {
            createTableQuery = createTableQuery + " NOT NULL";
          } else if (arr[2] === "u") {
            uniqueColumns.push(arr[0]);
          }
        } else if (arr.length === 4) {
          if (arr[2] === "n") {
            createTableQuery = createTableQuery + " NOT NULL";
          }
          if (arr[3] === "u") {
            uniqueColumns.push(arr[0]);
          }
        }
        if (i < attributes.length - 1) {
          createTableQuery += ", ";
        }
      }
      if (uniqueColumns.length > 0) {
        for (let i = 0; i < uniqueColumns.length; i++) {
          if (i === 0) {
            createTableQuery += ", ";
          }
          if (i === uniqueColumns.length - 1) {
            createTableQuery += "UNIQUE (" + uniqueColumns[i] + ")";
          } else {
            createTableQuery += "UNIQUE (" + uniqueColumns[i] + "), ";
          }
        }
      }
      createTableQuery += ");";
      try {
        connection.query(createTableQuery, (error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.status(201).send("Table Created✅");
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send(
            "Something error occurred in creating table due to internal server error"
          );
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in checking table's existence due to internal server error"
      );
  }
});

app.get("/deleteTable", (req, res) => {
  const name = req.query.name;
  const deleteTableQuery = `drop table ${name}s;`;
  try {
    connection.query(deleteTableQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      res.status(200).send(`Table ${name} is deleted✅`);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in deleting table due to internal server error"
      );
  }
});

app.get("/tableDetails", (req, res) => {
  const name = req.query.name;
  let tableDetailsQuery = `describe ${name.toLowerCase()}s;`;
  try {
    connection.query(tableDetailsQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      let data = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].Field === "id") {
          continue;
        }
        let a = {};
        a.field = result[i].Field;
        a.type = result[i].Type;
        a.isRequired = result[i].Null === "NO" ? true : false;
        data.push(a);
      }
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in getting table's details due to internal server error"
      );
  }
});

// Set data to a specific table
app.post("/setTableData", (req, res) => {
  const { name, attributes } = req.body;
  try {
    const checkTableExistQuery = `SELECT * FROM information_schema.tables WHERE table_schema = "${
      process.env.DATABASE_NAME
    }" AND table_name = "${name.toLowerCase()}s" LIMIT 1;`;
    connection.query(checkTableExistQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      if (result.length === 0) {
        return res.status(400).send("Table does not exist❌");
      }
      const descQuery = `describe ${name}s;`;
      try {
        connection.query(descQuery, (error, result) => {
          if (error) {
            throw new Error(error);
          }
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send(
            "Something error occurred in getting table description due to internal server error"
          );
      }
      let attributeNames = [];
      let attributeValues = [];
      for (let i = 0; i < attributes.length; i++) {
        attributeNames.push(attributes[i].split("|=|")[0]);
        attributeValues.push(attributes[i].split("|=|")[1]);
      }
      let insertQuery = `INSERT IGNORE INTO ${name.toLowerCase()}s (`;
      let i;
      for (i = 0; i < attributes.length - 1; i++) {
        insertQuery += `${attributeNames[i]}, `;
      }
      insertQuery += `${attributeNames[i]}) VALUES (`;
      for (i = 0; i < attributes.length - 1; i++) {
        insertQuery += `'${attributeValues[i]}', `;
      }
      insertQuery += `'${attributeValues[i]}');`;
      try {
        connection.query(insertQuery, (error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.status(201).send(`Data is added to table ${name}✅`);
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send(
            "Something error occurred in adding data into table due to internal server error"
          );
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in checking table's existence due to internal server error"
      );
  }
});

// Getting data from a specific table
app.get("/getTableData", (req, res) => {
  const tableName = req.query.tableName;
  try {
    const checkTableExistQuery = `SELECT * FROM information_schema.tables WHERE table_schema = "${
      process.env.DATABASE_NAME
    }" AND table_name = "${tableName.toLowerCase()}s" LIMIT 1;`;
    connection.query(checkTableExistQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      if (result.length === 0) {
        return res.status(400).send("Table does not exist❌");
      }
      var getTableQuery = `SELECT * FROM ${tableName.toLowerCase() + "s"};`;
      try {
        connection.query(getTableQuery, (error, result) => {
          if (error) {
            throw new Error(error);
          }
          res.status(200).send(result);
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send(
            "Something error occurred in getting table due to internal server error"
          );
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in checking table's existence due to internal server error"
      );
  }
});

app.post("/updateData", (req, res) => {
  const { tableName, id, data } = req.body;
  let updateQuery = `UPDATE ${tableName}s SET `;
  let i;
  for (i = 0; i < data.length - 1; i++) {
    let arr = data[i].split("|=|");
    updateQuery += `${arr[0]} = '${arr[1]}', `;
  }
  let arr = data[i].split("|=|");
  updateQuery += `${arr[0]} = '${arr[1]}' WHERE id = ${id};`;
  try {
    connection.query(updateQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      res
        .status(200)
        .send(`Row with id = ${id} of Table ${tableName} is updated⬆️`);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in updating data in table due to internal server error"
      );
  }
});

app.post("/deleteData", (req, res) => {
  const { tableName, id } = req.body;
  let deleteQuery = `DELETE from ${tableName}s WHERE id = ${id}`;
  try {
    connection.query(deleteQuery, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      res
        .status(200)
        .send(`Row with id = ${id} from Table ${tableName} is deleted🚮`);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Something error occurred in deleting data from table due to internal server error"
      );
  }
});

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}\nTest link ===> http://localhost:${port}/test`
  );
});
