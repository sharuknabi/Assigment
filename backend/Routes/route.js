const express = require("express");
const router = express.Router();
const controller = require("../controller/Data.Controller");

//POST: CREATE NEW DATA ENTRY
router.post("/create", controller.createData);

//GET: GET ALL DATA
// router.get("/", controller.getData);

//GET: SEARCHED DATA
router.get("/search", controller.searchData);

//GET:PAGINATED DATA
router.get("/paginate", controller.paginateData);

router.get("/check-duplicate-sno", controller.duplicate);

module.exports = router;
