import User from "../models/User.js";
import fs from "fs";
import ImageKit from "imagekit";
import imagekit from "../configs/imageKit.js";
import { url } from "inspector";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List a car

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let Car = JSON.parse(req.body.car);
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...Car, owner: _id, image });

    res.json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
