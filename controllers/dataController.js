const { success } = require("../utils/responseWrapper");

const getAlldataController = async (req, res) => {
  console.log(req._id);
  // return res.send("Here is the Data");
  return res.send(success(200, "Here is the Data"));
};

module.exports = {
  getAlldataController,
};
