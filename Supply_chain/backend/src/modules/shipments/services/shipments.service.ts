import { Injectable, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from '../schemas/shipment.schema';
import { GetShipmentsDto } from '../dto/get-shipments.dto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';

@Injectable()
export class ShipmentsService implements OnModuleInit {
  constructor(@InjectModel(Shipment.name) private shipmentModel: Model<Shipment>) {}

  async onModuleInit() {
    await this.generateSeedData();
  }

  async createShipment(dto: CreateShipmentDto): Promise<ShipmentDocument> {
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    const shipmentId = `NEX-${randomId}-QX-2024`;
    
    // Calculate ETA based on service level
    const etaDate = new Date();
    if (dto.serviceLevel === 'Next Day') {
      etaDate.setDate(etaDate.getDate() + 1);
    } else if (dto.serviceLevel === 'Economy') {
      etaDate.setDate(etaDate.getDate() + 14);
    } else {
      // Standard
      etaDate.setDate(etaDate.getDate() + 7);
    }

    const newShipment = new this.shipmentModel({
      shipmentId,
      status: 'In-Transit',
      origin: dto.origin,
      destination: dto.destination,
      carrier: dto.carrier,
      eta: etaDate,
      lastUpdate: new Date(),
      priority: dto.priority,
      type: dto.type,
      serviceLevel: dto.serviceLevel,
      weight: dto.weight,
      quantity: dto.quantity,
      packagingType: dto.packagingType,
      dimensions: dto.dimensions,
      description: dto.description
    });

    try {
      return await newShipment.save();
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: err.message,
        details: err
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generateSeedData() {
    // Seed initial mock data if none exists
    const count = await this.shipmentModel.countDocuments();
    if (count === 0) {
      const mockShipments = [
        { shipmentId: "NX-8921-00", status: "In-Transit", eta: new Date(Date.now() + 86400000 * 2), origin: "Shanghai, CN", destination: "Los Angeles, US", carrier: "Apex Logistics", lastUpdate: new Date(Date.now() - 1000 * 60 * 24) },
        { shipmentId: "NX-8921-01", status: "Delayed", eta: new Date(Date.now() + 86400000 * 4), origin: "Hamburg, DE", destination: "New York, US", carrier: "Global Freight", lastUpdate: new Date(Date.now() - 1000 * 60 * 120) },
        { shipmentId: "NX-8921-02", status: "Delivered", eta: new Date(Date.now() - 86400000), origin: "Tokyo, JP", destination: "London, UK", carrier: "QuickShip Inc.", lastUpdate: new Date(Date.now() - 86400000) },
        { shipmentId: "NX-8921-03", status: "In-Transit", eta: new Date(Date.now() + 86400000 * 5), origin: "Seoul, KR", destination: "San Francisco, US", carrier: "Apex Logistics", lastUpdate: new Date(Date.now() - 1000 * 60 * 5) },
        { shipmentId: "NX-8921-04", status: "Critical", eta: new Date(Date.now() + 86400000), origin: "Mumbai, IN", destination: "Dubai, AE", carrier: "Express Route", lastUpdate: new Date(Date.now() - 1000 * 60 * 12) },
        { shipmentId: "NX-8921-05", status: "In-Transit", eta: new Date(Date.now() + 86400000 * 3), origin: "Singapore, SG", destination: "Rotterdam, NL", carrier: "Global Freight", lastUpdate: new Date(Date.now() - 1000 * 60 * 180) },
        { shipmentId: "NX-8921-06", status: "Delivered", eta: new Date(Date.now() - 86400000 * 2), origin: "Sao Paulo, BR", destination: "Miami, US", carrier: "QuickShip Inc.", lastUpdate: new Date(Date.now() - 86400000 * 2) },
        { shipmentId: "NX-8921-07", status: "Delayed", eta: new Date(Date.now() + 86400000 * 4), origin: "Sydney, AU", destination: "Hong Kong, HK", carrier: "Apex Logistics", lastUpdate: new Date(Date.now() - 1000 * 60 * 45) },
        { shipmentId: "NX-8921-08", status: "In-Transit", eta: new Date(Date.now() + 86400000 * 2), origin: "Bangkok, TH", destination: "Vancouver, CA", carrier: "SkyPort Cargo", lastUpdate: new Date(Date.now() - 1000 * 60 * 60) },
        { shipmentId: "NX-8921-09", status: "Delivered", eta: new Date(Date.now() - 86400000 * 3), origin: "Copenhagen, DK", destination: "Madrid, ES", carrier: "Euro Trans", lastUpdate: new Date(Date.now() - 86400000 * 3) }
      ];
      await this.shipmentModel.insertMany(mockShipments);
      console.log('Shipment mock data seeded.');
    }
  }

  async getShipments(queryDto: GetShipmentsDto) {
    const { search, status, carrier, startDate, endDate, page = 1, limit = 10 } = queryDto;
    
    const query: any = {};

    if (search) {
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All Statuses') {
      query.status = status;
    }

    if (carrier && carrier !== 'All Carriers') {
      query.carrier = carrier;
    }

    if (startDate && endDate) {
      query.eta = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.shipmentModel.find(query).sort({ lastUpdate: -1 }).skip(skip).limit(limit).exec(),
      this.shipmentModel.countDocuments(query).exec()
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
