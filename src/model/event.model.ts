import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

export const enumType = ["stake", "withdraw", "rebalance"];

export type EnumType = (typeof enumType)[number];

const eventSchema = new Schema(
  {
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
  },
  {
    // timestamps: { createdAt: true, updatedAt: true },
  }
);

export const Event = mongoose.model("AllEvent", eventSchema);
export type IEvent = InferSchemaType<typeof eventSchema>;
