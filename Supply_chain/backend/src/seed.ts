import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supply_chain';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const db = mongoose.connection.db!;

  console.log('Clearing old collections for clean seed...');
  await db.collection('shipments').deleteMany({});
  await db.collection('inventoryitems').deleteMany({});
  await db.collection('workflowtasks').deleteMany({});

  const now = new Date();

  // Seed Inventory
  console.log('Seeding inventory...');
  const inventoryData = [
    { sku: 'WIDGET-001', name: 'Alpha Widget', quantity: 50, safetyStock: 100, warehouseId: 'WH-East', category: 'Electronics', unitPrice: 25.5, status: 'low_stock', lastUpdated: now },
    { sku: 'WIDGET-002', name: 'Beta Widget', quantity: 200, safetyStock: 50, warehouseId: 'WH-West', category: 'Electronics', unitPrice: 15.0, status: 'in_stock', lastUpdated: now },
    { sku: 'GIZMO-110', name: 'Quantum Gizmo', quantity: 10, safetyStock: 20, warehouseId: 'WH-North', category: 'Hardware', unitPrice: 150.0, status: 'low_stock', lastUpdated: now },
  ];
  await db.collection('inventoryitems').insertMany(inventoryData);

  // Seed Shipments
  console.log('Seeding shipments...');
  const statuses = ['pending', 'in_transit', 'customs', 'delivered', 'exception'];
  const shipmentData: any[] = [];
  for (let i = 0; i < 50; i++) {
    // Distribute createdAt over the last 7 days
    const daysAgo = Math.floor(Math.random() * 7);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + 10 * 60 * 60 * 1000);

    let status = statuses[Math.floor(Math.random() * statuses.length)];
    if (daysAgo > 4) status = 'delivered'; // Older items likely delivered
    
    shipmentData.push({
      trackingNumber: `TRK-${10000 + i}`,
      origin: `City ${Math.floor(Math.random() * 5)}`,
      destination: `City ${Math.floor(Math.random() * 5) + 5}`,
      status,
      carrier: i % 2 === 0 ? 'FedEx' : 'DHL',
      estimatedDelivery: new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000),
      createdAt,
      updatedAt
    });
  }
  await db.collection('shipments').insertMany(shipmentData);

  // Seed Workflows
  console.log('Seeding workflows...');
  const workflowData: any[] = [];
  const wfStatuses = ['open', 'in_progress', 'resolved', 'escalated'];
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    workflowData.push({
      title: `Task #${1000 + i}`,
      description: `Description for workflow task ${i}`,
      status: wfStatuses[Math.floor(Math.random() * wfStatuses.length)],
      priority: i % 3 === 0 ? 'high' : 'medium',
      assignedTo: 'admin',
      createdAt,
      updatedAt: createdAt
    });
  }
  await db.collection('workflowtasks').insertMany(workflowData);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
