const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

//POST: CREATE NEW DATA ENTRY
router.post("/", controller.createData);

//GET: GET ALL DATA
router.get("/", controller.getData);

//GET: SEARCHED DATA
router.get("/search", controller.searchData);

//GET:PAGINATED DATA
router.get("/paginate", controller.paginateData);

module.exports = router;
