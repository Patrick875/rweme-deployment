const { Village, Cell, sector, District, Province } = require("./../models/index");

const getAllProvinces = async (req, res) => {
	const provinces = await Province.findAll();
	return res.status(200).json({
		status: "success",
		data: provinces,
		dataLength: provinces.length,
	});
};

const getAllDistricts = async (req, res) => {
	const districts = await District.findAll();
	return res.status(200).json({
		status: "success",
		data: districts,
		dataLength: districts.length,
	});
};
const getAllSectors = async (req, res) => {
	const sectors = await sector.findAll();
	return res.status(200).json({
		status: "success",
		data: sectors,
		dataLength: sectors.length,
	});
};
const getAllCells = async (req, res) => {
	const cells = await Cell.findAll();
	return res.status(200).json({
		status: "success",
		data: cells,
		dataLength: cells.length,
	});
};
const getAllVillages = async (req, res) => {
	const villages = await Village.findAll();
	return res.status(200).json({
		status: "success",
		data: villages,
		dataLength: villages.length,
	});
};

const getDistrictsByProvince = async (req, res) => {
	const provinceId = req.params.provinceId;
	if (!provinceId) {
		return res.status(400).json({
			status: "Bad request",
			message: "provinceId param is required",
		});
	}
	const districts = await District.findAll({
		where: {
			provinceId,
		},
	});
	return res.status(200).json({
		status: "success",
		data: districts,
		dataLength: districts.length,
	});
};

const getSectorsByDistrict = async (req, res) => {
	const districtId = req.params.districtId;
	if (!districtId) {
		return res.status(400).json({
			status: "Bad request",
			message: "districtId param is required",
		});
	}

	const sectors = await District.findAll({
		where: {
			districtId,
		},
	});
	// res.Ok()
	return res.status(200).json({
		status: "success",
		data: sectors,
		dataLength: sectors.length,
	});
};
const getCellsBySector = async (req, res) => {
	const sectorId = req.params.sectorId;
	if (!sectorId) {
		return res.status(400).json({
			status: "Bad request",
			message: "sectorId param is required",
		});
	}
	const cells = await Cell.findAll({
		where: {
			sectorId,
		},
	});
	return res.status(200).json({
		status: "success",
		data: cells,
		dataLength: cells.length,
	});
};
const getVillagesByCell = async (req, res) => {
	const cellId = req.params.cellId;
	if (!cellId) {
		return res.status(400).json({
			status: "Bad request",
			message: "cellId param is required",
		});
	}

	const villages = await Village.findAll({
		where: {
			cellId,
		},
	});
	return res.status(200).json({
		status: "success",
		data: villages,
		dataLength: villages.length,
	});
};

const getProvince = async (req, res) => {
	const provinceId = req.params.provinceId;
	if (!provinceId) {
		return res.status(400).json({
			status: "Bad request",
			message: "provinceId param is required",
		});
	}
	const province = await Province.findByPk(provinceId, {
		include: [
			{
				model: District,
				include: [
					{
						model: sector,
						include: [
							{
								model: Cell,
								include: [
									{
										model: Village,
									},
								],
							},
						],
					},
				],
			},
		],
	});
	return res.status(200).json({
		status: "Success",
		data: province,
	});
};

const getDistrict = async (req, res) => {
	const { districtId, provinceId } = req.params;
	if (!provinceId || !districtId) {
		return res.status(400).json({
			status: "Bad request",
			message: "provinceId and districtId params are required",
		});
	}
	const district = await District.findOne({
		where: {
			id: districtId,
			provinceId,
		},
		include: [
			{
				model: sector,
				include: [
					{
						model: Cell,
						include: [
							{
								model: Village,
							},
						],
					},
				],
			},
		],
	});
	return res.status(200).json({
		status: "Success",
		data: district,
	});
};

const getSector = async (req, res) => {
	const { sectorId, districtId, provinceId } = req.params;
	if (!sectorId || !districtId || !provinceId) {
		return res.status(400).json({
			status: "Bad request",
			message: "provinceId,districtId and sectorId param are required",
		});
	}
	const foundSector = await sector.findOne({
		where: {
			id: sectorId,
			districtId,
			provinceId,
		},
		include: [
			{
				model: Cell,
				include: {
					model: Village,
				},
			},
		],
	});
	return res.status(200).json({
		status: "Success",
		data: foundSector,
	});
};
const getCell = async (req, res) => {
	const { cellId, sectorId, districtId, provinceId } = req.params;
	if (!cellId || !sectorId || !districtId || !provinceId) {
		return res.status(400).json({
			status: "Success",
			message: "provinceId,districtId,sectorId and cellId params are required",
		});
	}
	const cell = await Cell.findOne({
		where: {
			id: cellId,
			sectorId,
			districtId,
			provinceId,
		},
		include: [
			{
				model: Village,
			},
		],
	});
	return res.status(200).json({
		status: "success",
		data: cell,
	});
};
const getVillage = async (req, res) => {
	const { villageId, cellId, sectorId, districtId, provinceId } = req.params;
	if (villageId || !cellId || !sectorId || !districtId || !provinceId) {
		return res.status(400).json({
			status: "Success",
			message: "provinceId,districtId,sectorId,cellId and villageId params are required",
		});
	}
	const village = await Village.findOne({
		where: {
			id: villageId,
			cellId,
			sectorId,
			districtId,
			provinceId,
		},
	});
	return res.status(200).json({
		status: "Success",
		data: village,
	});
};
module.exports = {
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
};
