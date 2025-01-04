import mongoose, { InferSchemaType } from "mongoose";

export const enumType = ["stake", "withdraw", "rebalance"];

export type EnumType = (typeof enumType)[number];


const schemaDefinition = {
  from: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: enumType,
  },
  txId: {
    type: String,
    required: true,
    unique: true,
  },
  coreAmount: {
    type: String,
  },
  sCoreAmount: {
    type: String,
  },
  // strategies: [String], 
  // stakeAmounts: [String],
  // totalAmounts: [String],
}

const eventSchema = new mongoose.Schema(schemaDefinition, {
  timestamps: {createdAt: true, updatedAt: true},
  collection: "all-events"
})

export const Event = mongoose.model("AllEvent", eventSchema);
export type IEvent = InferSchemaType<typeof schemaDefinition>;
