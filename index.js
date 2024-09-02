const mongoose = require('mongoose');
const express = require('express');
const { Admin, Bus, Driver, DriverAss, Route, Schedule, Monitoring } = require('./schema.js');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyparser.json());
app.use(cors());

async function connectTodb() {
    try {
        await mongoose.connect('mongodb+srv://charubalab:Charu2004@cluster0.tktmk2c.mongodb.net/SchediGo?retryWrites=true&w=majority&appName=Cluster0');
        console.log("db connection established");
        const port = process.env.PORT || 8000;
        app.listen(port, function() {
            console.log(`listening on ${port}....`);
        });
    } catch (error) {
        console.log(error);
        console.log("couldn't connect to db");
    }
}
connectTodb();

// Admin routes
app.post('/add-Admin', async function(request, response) {
    try {
        await Admin.create({
            "name": request.body.name,
            "phoneNumber": request.body.phoneNumber,
            "privateId": request.body.privateId
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Admin', async function(request, response) {
    try {
        const admindetails = await Admin.find();
        response.status(200).json({ "total": admindetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

// Bus routes
app.post('/add-Bus', async function(request, response) {
    try {
        await Bus.create({
            "busNumber": request.body.busNumber,
            "capacity": request.body.capacity,
            "status": request.body.status,
            "location": {
                "from": request.body.from,
                "to": request.body.to
            },
            "lastUpdated": request.body.lastUpdated,
            "price":request.body.price
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Bus', async function(request, response) {
    try {
        const busdetails = await Bus.find();
        response.status(200).json({ "total": busdetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

app.patch('/update-Bus/:id', async function(request, response) {
    try {
        const busEntry = await Bus.findById(request.params.id);
        if (!busEntry) {
            return response.status(404).json({
                status: "failed",
                message: "Bus not found"
            });
        }

        const updateData = {};

        if (request.body.status !== undefined) {
            updateData.status = request.body.status;
        }
        if (request.body.from !== undefined && request.body.to !== undefined) {
            updateData.location = {
                from: request.body.from,
                to: request.body.to
            };
        }
        if (request.body.lastUpdated !== undefined) {
            updateData.lastUpdated = request.body.lastUpdated;
        }

        if (Object.keys(updateData).length > 0) {
            await busEntry.updateOne({ $set: updateData });
            response.status(200).json({
                status: "success",
                message: "Bus updated successfully"
            });
        } else {
            response.status(400).json({
                status: "failed",
                message: "No fields to update"
            });
        }
    } catch (error) {
        response.status(500).json({
            status: "failed",
            message: "Update failed",
            error: error.message || error
        });
    }
});

// Driver routes
app.post('/add-Driver', async function(request, response) {
    try {
        await Driver.create({
            "driverId": request.body.driverId,
            "name": request.body.name,
            "licenseNumber": request.body.licenseNumber,
            "contact": request.body.contact
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Driver', async function(request, response) {
    try {
        const driverdetails = await Driver.find();
        response.status(200).json({ "total": driverdetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

// Driver Assignment routes
app.post('/add-DriverAss', async function(request, response) {
    try {
        await DriverAss.create({
            "driverId": request.body.driverId,
            "assignedBus": request.body.assignedBus,
            "status": request.body.status
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-DriverAss', async function(request, response) {
    try {
        const driverAssdetails = await DriverAss.find();
        response.status(200).json({ "total": driverAssdetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

app.patch('/update-DriverAss/:id', async function(request, response) {
    try {
        const driverEntry = await DriverAss.findById(request.params.id);
        if (!driverEntry) {
            return response.status(404).json({
                status: "failed",
                message: "Driver Assignment not found"
            });
        }

        const updateData = {};

        if (request.body.status !== undefined) {
            updateData.status = request.body.status;
        }
        if (request.body.assignedBus !== undefined) {
            updateData.assignedBus = request.body.assignedBus;
        }

        if (Object.keys(updateData).length > 0) {
            await driverEntry.updateOne({ $set: updateData });
            response.status(200).json({
                status: "success",
                message: "Driver Assignment updated successfully"
            });
        } else {
            response.status(400).json({
                status: "failed",
                message: "No fields to update"
            });
        }
    } catch (error) {
        response.status(500).json({
            status: "failed",
            message: "Update failed",
            error: error.message || error
        });
    }
});

// Route routes
app.post('/add-Route', async function(request, response) {
    try {
        await Route.create({
            "routeNumber": request.body.routeNumber,
            "startLocation": request.body.startLocation,  // Corrected
            "endLocation": request.body.endLocation,      // Corrected
            "waypoints": request.body.waypoints,
            "distance": request.body.distance,
            "estimatedTime": request.body.estimatedTime
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Route', async function(request, response) {
    try {
        const routedetails = await Route.find();
        response.status(200).json({ "total": routedetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

// Schedule routes
app.post('/add-Schedule', async function(request, response) {
    try {
        await Schedule.create({
            "driverId": request.body.driverId,
            "routeId": request.body.routeId,
            "startTime": request.body.startTime,
            "endTime": request.body.endTime,
            "scheduleType": request.body.scheduleType,
            "status": request.body.status
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Schedule', async function(request, response) {
    try {
        const scheduledetails = await Schedule.find();
        response.status(200).json({ "total": scheduledetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

app.patch('/update-schedule/:id', async function(request, response) {
    try {
        const scheduleEntry = await Schedule.findById(request.params.id);
        if (!scheduleEntry) {
            return response.status(404).json({
                "status": "failed",
                "message": "Schedule not found"
            });
        }

        await scheduleEntry.updateOne({
            "routeId": request.body.routeId,
            "startTime": request.body.startTime,
            "endTime": request.body.endTime,
            "scheduleType": request.body.scheduleType,
            "status": request.body.status
        });
        response.status(200).json({ "status": "updated successfully" });
    } catch (error) {
        response.status(500).json({
            "status": "failed",
            "message": "Update failed",
            "error": error.message || error
        });
    }
});

// Monitoring routes
app.post('/add-Monitoring', async function(request, response) {
    try {
        await Monitoring.create({
            "busId": request.body.busId,
            "timestamp": request.body.timestamp,
            "location": {
                "latitude": request.body.latitude,
                "longitude": request.body.longitude
            },
            "speed": request.body.speed,
            "occupancy": request.body.occupancy,
            "temperature": request.body.temperature,
            "fuelLevel": request.body.fuelLevel
        });
        response.status(200).json({ "status": "inserted successfully" });
    } catch (error) {
        response.status(400).json({
            "error-occurrence": error,
            "status": "not inserted successfully"
        });
    }
});

app.get('/get-Monitoring', async function(request, response) {
    try {
        const monitoringdetails = await Monitoring.find();
        response.status(200).json({ "total": monitoringdetails });
    } catch (error) {
        response.status(500).json({
            "status": "not successfully received",
            "error": error
        });
    }
});

app.patch('/update-monitoring/:id', async function(request, response) {
    try {
        const monitoringEntry = await Monitoring.findById(request.params.id);
        if (!monitoringEntry) {
            return response.status(404).json({
                "status": "failed",
                "message": "Monitoring entry not found"
            });
        }

        await monitoringEntry.updateOne({
            "timestamp": request.body.timestamp,
            "location": {
                "latitude": request.body.latitude,
                "longitude": request.body.longitude
            },
            "speed": request.body.speed,
            "occupancy": request.body.occupancy,
            "temperature": request.body.temperature,
            "fuelLevel": request.body.fuelLevel
        });
        response.status(200).json({ "status": "updated successfully" });
    } catch (error) {
        response.status(500).json({
            "status": "failed",
            "message": "Update failed",
            "error": error.message || error
        });
    }
});
