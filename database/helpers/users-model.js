const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select("*");
}

// for login
function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

// for register
async function add(user) {
  const [id] = await db("users").insert(user);

  return findById(id);
}

function findById(id) {
  return db("users")
    .where({ id: Number(id) })
    .first();
}
