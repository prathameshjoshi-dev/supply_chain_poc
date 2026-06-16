const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'manager', 'supervisor', 'viewer'], default: 'viewer' },
  warehouseIds: { type: [String], default: [] },
  warehouseScope: String,
  avatar: String,
  lastActivity: Date,
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
});
const User = mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect('mongodb+srv://prathameshjoshi_db_user:kRLYlKXhciFr808C@cluster0.3t3dlqx.mongodb.net/?appName=Cluster0');
  try {
    const createdUser = new User({
      name: 'Test',
      email: 'test' + Date.now() + '@example.com',
      passwordHash: '',
      role: 'viewer',
      warehouseIds: [],
      status: 'active',
    });
    await createdUser.save();
    console.log('Saved successfully');
  } catch(e) {
    console.error('Error saving:', e.message);
  } finally {
    mongoose.disconnect();
  }
}
run();
