const Info = require("../models/Info");

exports.getChaturmasData = async (req, res) => {
  try {
    const chaturmasData = await Info.find();
    res.json(chaturmasData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Chaturmas data" });
  }
};

exports.createChaturmasEntry = async (chaturmasEntry) => {
  try {
    console.log("Saving entry:", chaturmasEntry);

    const infoData = await chaturmasEntry.save();
    console.log("Entry created:", infoData);
    return infoData;
  } catch (error) {
    console.error("Error creating entry:", error);
    throw new Error("Error creating entry");
  }
};
