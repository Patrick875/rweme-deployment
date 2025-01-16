const {
	getAllProvinces,
	getAllDistricts,
	getAllSectors,
	getAllCells,
	getAllVillages,
	getDistrictsByProvince,
	getSectorsByDistrict,
	getCellsBySector,
	getVillagesByCell,
	getProvince,
	getDistrict,
	getSector,
	getCell,
	getVillage,
} = require("../controllers/addressController");

const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.get("/provinces", asyncWrapper(getAllProvinces));
router.get("/provinces/:provinceId", getProvince);
router.get("/districts", getAllDistricts);
router.get("/districts/:provinceId", getDistrictsByProvince);
router.get("/districts/:districtId/:provinceId", getDistrict);
router.get("/sectors", getAllSectors);
router.get("/sectors/:districtId", getSectorsByDistrict);
router.get("/sectors/:sectorId/:districtId/:provinceId", getSector);
router.get("/cells", getAllCells);
router.get("/cells/:sectorId", getCellsBySector);
router.get("/cells/:cellId/:sectorId/:districtId/:provinceId", getCell);
router.get("/villages", getAllVillages);
router.get("/villages/:cellId", getVillagesByCell);
router.get("/villages/:villageId/:cellId/:sectorId/:districtId/:provinceId", getVillagesByCell);

module.exports = router;
