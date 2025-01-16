const findAll = async (Module, includesObj, queryParams) => {
	const results = await Module.findAll();
	return results;
};
const findOne = async (Module, itemId, includesObj, queryParams) => {
	const result = await Module.findById(itemId);
	return result;
};
const createEntity = async (Module, createObj) => {
	const createdEntity = await Module.create(createObj);
};
const update = async (Module, itemId, updateObj) => {
	const item = await Module.findById(itemId);
	if (!item) {
		return null;
	}
	await Module.update(updateObj, { where: { id: itemId } });
	const updatedItem = await Module.findById(itemId);
	return updatedItem;
};
const deleteItem = async (Module, itemId) => {
	const item = await Module.findById(itemId);
	if (!item) {
		return null;
	}
	await Module.destroy({ where: { id: itemId } });
};

module.export = { findAll, findOne, update, deleteItem };
