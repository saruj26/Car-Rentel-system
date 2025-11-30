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
