import mongoose, { InferSchemaType } from "mongoose";

const schemaDefinition = {
  from: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  txId: {
    type: String,
    required: true,
  },
  coreAmount: {
    type: String,
  },
  sCoreAmount: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
};

const eventSchema = new mongoose.Schema(schemaDefinition, {
  timestamps: { createdAt: true, updatedAt: true },
  collection: "allEvents",
});

eventSchema.index(
  {
    type: 1,
    txId: 1,
  },
  {
    unique: true,
  }
);

export const Event = mongoose.model("allEvents", eventSchema);
export type IEvent = InferSchemaType<typeof schemaDefinition>;
