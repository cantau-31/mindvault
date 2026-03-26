import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

type UserCollectionDocument = {
  _id: ObjectId;
  ownerId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CollectionsService {
  private readonly collectionsCollection: Collection<UserCollectionDocument>;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.collectionsCollection =
      this.connection.collection<UserCollectionDocument>('collections');
  }

  async create(
    userId: string,
    dto: CreateCollectionDto,
  ): Promise<UserCollectionDocument> {
    const now = new Date();
    const doc: Omit<UserCollectionDocument, '_id'> = {
      ownerId: userId,
      name: dto.name,
      description: dto.description ?? '',
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collectionsCollection.insertOne(
      doc as UserCollectionDocument,
    );

    return { _id: result.insertedId, ...doc };
  }

  async findAllByUser(userId: string): Promise<UserCollectionDocument[]> {
    return this.collectionsCollection
      .find({ ownerId: userId })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async findOneById(
    userId: string,
    collectionId: string,
  ): Promise<UserCollectionDocument> {
    return this.findOwnedCollectionOrThrow(userId, collectionId);
  }

  async update(
    userId: string,
    collectionId: string,
    dto: UpdateCollectionDto,
  ): Promise<UserCollectionDocument> {
    const collection = await this.findOwnedCollectionOrThrow(userId, collectionId);

    const updateData: Partial<UserCollectionDocument> = {
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    await this.collectionsCollection.updateOne(
      { _id: collection._id },
      { $set: updateData },
    );

    return {
      ...collection,
      ...updateData,
    };
  }

  async remove(
    userId: string,
    collectionId: string,
  ): Promise<{ message: string }> {
    const collection = await this.findOwnedCollectionOrThrow(userId, collectionId);

    await this.collectionsCollection.deleteOne({ _id: collection._id });
    return { message: 'Collection deleted successfully' };
  }

  private async findOwnedCollectionOrThrow(
    userId: string,
    collectionId: string,
  ): Promise<UserCollectionDocument> {
    const parsedId = this.parseObjectId(collectionId);
    const collection = await this.collectionsCollection.findOne({ _id: parsedId });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.ownerId !== userId) {
      throw new ForbiddenException('You cannot access this collection');
    }

    return collection;
  }

  private parseObjectId(value: string): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid collection id');
    }
    return new ObjectId(value);
  }
}
