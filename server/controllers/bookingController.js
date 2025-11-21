import Booking from "../models/Booking.js"
import Car from "../models/Car.js";



// function to check availability of cars for an owner
const checkCarAvailability = async (car, pickUpDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickUpDate: { $lte: returnDate },
        returnDate: { $gte: pickUpDate },
    })
    return bookings.length === 0;

}

// API to check availability of cars for for the given date and location

export const checkCarAvailabilityOfCar = async (req, res) => {
    try{
        const {location, pickUpDate, returnDate} = req.body;

        const cars = await Car.find({location, isAvaliable: true});

        const availableCarsPromises =cars.map(async (car) => {
            const isAvailable = await checkCarAvailability(car._id, new Date(pickUpDate), new Date(returnDate)) ? car : null;
            return {...car._doc, isAvailable: isAvailable};  
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable == true);

        res.json({success: true, availableCars});
    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to Create a booking
export const createBooking = async (req, res) => {
    try{

        const {_id} = req.user;
        const {car,pickUpDate, returnDate} = req.body;

        const isAvailable = await checkCarAvailability(car, new Date(pickUpDate), new Date(returnDate));
        if(!isAvailable){
            return res.json({ success:false, message: "Car is not available for the selected dates"});
        }

        const carData = await Car.findById(car);

        // calculate price
        const picked = new Date(pickUpDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = noOfDays * carData.pricePerDay;

         await Booking.create({ car, owner: carData.owner, user: _id, pickUpDate: new Date(pickUpDate), returnDate: new Date(returnDate), price});
         res.json({success: true, message: "Booking created successfully"});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }

}


// API to List User Bookings
export const getUserBookings = async (req, res) => {
    try{
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate('car').sort({createdAt: -1});
        res.json({success: true, bookings});            
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try{
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Access denied"});
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car').populate('user').select("-user.password").sort({createdAt: -1});
        res.json({success: true, bookings});           
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Update Booking Status
export const changeBookingStatus = async (req, res) => {
    try{
        const {_id} = req.user;
        const {bookingId, status} = req.body;

        const booking = await Booking.findById(bookingId);

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "You are not authorized to perform this action"});
        }

        booking.status = status;
        await booking.save();

        res.json({success: true, message: "Booking status updated successfully"});
                 
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
