const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const model = mongoose.model;
// BusSchema
const busSchema = new Schema({
  busNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' },
  location: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  lastUpdated: { type: Date, default: Date.now },
  price:{type:Number,required:true}
});

// DriverSchema
const driverSchema = new Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  contact: { type: String, required: true },
});

// DriverAssSchema
const driverAssSchema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },  // Updated to reference Driver model
  assignedBus: { type: Schema.Types.ObjectId, ref: 'Bus' },
  status: { type: String, enum: ['Available', 'On Duty', 'Rest'], default: 'Available' }
});

// RouteSchema
const routeSchema = new Schema({
  routeNumber: { type: String, required: true, unique: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  waypoints: [{ type: String }],
  distance: { type: Number, required: true }, 
  estimatedTime: { type: String, required: true }, 
});

// ScheduleSchema 
const scheduleSchema = new Schema({
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
  routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  scheduleType: { type: String, enum: ['Linked', 'Unlinked'], required: true },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'], default: 'Scheduled' }
});

// MonitoringSchema
const monitoringSchema = new Schema({
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },  // Ensured reference to Bus model
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  speed: { type: Number },
  occupancy: { type: Number },
  temperature: { type: Number },
  fuelLevel: { type: Number },
});

// AdminSchema
const adminSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String },
  privateId: { type: String, required: true, unique: true }  // Added unique constraint
});

const Admin = model('Admin', adminSchema);
const Bus = model('Bus', busSchema);
const Driver = model('Driver', driverSchema);
const DriverAss = model('DriverAss', driverAssSchema);
const Route = model('Route', routeSchema);
const Schedule = model('Schedule', scheduleSchema);
const Monitoring = model('Monitoring', monitoringSchema);

module.exports={ Admin, Bus, Driver, DriverAss, Route, Schedule, Monitoring };
