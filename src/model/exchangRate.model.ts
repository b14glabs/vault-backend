import mongoose, { InferRawDocType } from "mongoose";

const schemaDefinition = {
  blockNumber: {
    type: Number,
    required: true,
    unique: true
  },
  exchangeRate: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
};

const schema = new mongoose.Schema(schemaDefinition, {
  timestamps: { createdAt: true, updatedAt: true },
  collection: "exchangeRates",
});

export const ExchangeRate = mongoose.model("exchangeRates", schema);
export type IExchangeRate = InferRawDocType<typeof schemaDefinition>;
