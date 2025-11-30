import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

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
    // accept either `car` or `carData` for compatibility
    const rawCar = req.body.car || req.body.carData;
    if (!rawCar) {
      return res
        .status(400)
        .json({ success: false, message: "Missing car data" });
    }
    let car;
    try {
      car = JSON.parse(rawCar);
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid car JSON" });
    }

    const files = req.files || [];
    if (!files.length) {
      return res
        .status(400)
        .json({ success: false, message: "No image files uploaded" });
    }

    // upload each file to imagekit and collect URLs
    const uploadedUrls = [];
    for (const file of files) {
      const fileBuffer = fs.readFileSync(file.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: file.originalname,
        folder: "/cars",
      });

      const optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { width: "1280" },
          { quality: "auto" },
          { format: "webp" },
        ],
      });

      uploadedUrls.push(optimizedImageUrl);
      // remove temp file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        // ignore
      }
    }

    const primaryImage = uploadedUrls[0];
    await Car.create({
      ...car,
      owner: _id,
      image: primaryImage,
      images: uploadedUrls,
    });
    res.json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get all cars of an owner
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Toggle car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // check if the car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    car.isAvailale = !car.isAvailale;
    await car.save();

    res.json({
      success: true,
      message: "Car Availability updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // check if the car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    car.owner = null;
    car.isAvailale = false;
    await car.save();

    res.json({ success: true, message: "Car Removed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to get Dashboard Data

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({
        success: false,
        message: "You are not authorized to access this data",
      });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // calculate total earnings
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    return res.json({ success: true, DashboardData: dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;
    // upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, { image });

    res.json({
      success: true,
      message: "Profile image updated successfully",
      image,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to update car details (owner)
export const updateCar = async (req, res) => {
  try {
    const { _id } = req.user;
    // car data can be in `car` or `carData` (JSON string)
    const rawCar = req.body.car || req.body.carData;
    if (!rawCar) {
      return res
        .status(400)
        .json({ success: false, message: "Missing car data" });
    }

    let carUpdate;
    try {
      carUpdate = JSON.parse(rawCar);
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid car JSON" });
    }

    const carId = req.body.carId || req.body.carID || carUpdate._id;
    if (!carId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing car id" });
    }

    const existing = await Car.findById(carId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // ensure owner
    if (!existing.owner || existing.owner.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }
    const files = req.files || [];
    let uploadedUrls = [];

    // Upload files to imagekit with robust error handling and cleanup
    if (files.length) {
      try {
        for (const file of files) {
          const fileBuffer = fs.readFileSync(file.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: file.originalname,
            folder: "/cars",
          });

          const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
              { width: "1280" },
              { quality: "auto" },
              { format: "webp" },
            ],
          });

          uploadedUrls.push(optimizedImageUrl);
        }
      } catch (uploadErr) {
        // cleanup any temp files
        for (const f of files) {
          try {
            fs.unlinkSync(f.path);
          } catch (e) {}
        }
        console.error("Image upload failed:", uploadErr.message || uploadErr);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      } finally {
        // remove temp files from disk
        for (const f of files) {
          try {
            fs.unlinkSync(f.path);
          } catch (e) {}
        }
      }
    }

    // Determine final images: consider kept images from client, existing images, and newly uploaded images
    const existingImages =
      existing.images && existing.images.length
        ? existing.images
        : existing.image
        ? [existing.image]
        : [];
    const keptFromClient = Array.isArray(carUpdate.images)
      ? carUpdate.images
      : undefined;
    let finalImages = [];

    if (keptFromClient && keptFromClient.length) {
      finalImages = keptFromClient.slice();
    } else {
      finalImages = existingImages.slice();
    }

    if (uploadedUrls.length) {
      finalImages = finalImages.concat(uploadedUrls);
    }

    if (finalImages.length) {
      carUpdate.images = finalImages;
      carUpdate.image = finalImages[0];
    } else {
      carUpdate.images = [];
      carUpdate.image = "";
    }

    // coerce numeric fields if provided and validate
    const numericFields = ["year", "pricePerDay", "seating_capacity"];
    for (const nf of numericFields) {
      if (carUpdate[nf] !== undefined) {
        const num = Number(carUpdate[nf]);
        if (Number.isNaN(num)) {
          return res.status(400).json({
            success: false,
            message: `Invalid numeric value for ${nf}`,
          });
        }
        carUpdate[nf] = num;
      }
    }

    // apply update (only allowed fields)
    const allowed = [
      "brand",
      "model",
      "year",
      "pricePerDay",
      "category",
      "transmission",
      "fuel_type",
      "seating_capacity",
      "location",
      "description",
      "image",
      "images",
    ];

    const updatePayload = {};
    for (const key of allowed) {
      if (carUpdate[key] !== undefined) updatePayload[key] = carUpdate[key];
    }

    const updated = await Car.findByIdAndUpdate(
      carId,
      { $set: updatePayload },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updated,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
