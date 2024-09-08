import mongoose, { Document, Model, Schema } from "mongoose";

export type ForecastDTO = {
  blue: number;
  orange: number;
  matchId: number;
  tournamentId: number;
  date: string;
};

export interface ForecastDocument extends Document {
  blue: number;
  orange: number;
  matchId: number;
  tournamentId: number;
  userId: string;
  date: string;
  processed: boolean;
  correct: boolean;
  exact: boolean;
  createdAt: string;
  updatedAt: string;
}

const ForecastSchema: Schema<ForecastDocument> = new Schema(
  {
    blue: {
      type: Number,
      required: true,
    },
    orange: {
      type: Number,
      required: true,
    },
    matchId: {
      type: Number,
      required: true,
    },
    tournamentId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    processed: {
      type: Boolean,
      required: true,
      default: false,
    },
    correct: {
      type: Boolean,
      required: true,
      default: false,
    },
    exact: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "forecasts", timestamps: true },
);

ForecastSchema.index({ userId: 1, matchId: 1 }, { unique: true });

export const Forecast: Model<ForecastDocument> =
  mongoose.model<ForecastDocument>("Forecast", ForecastSchema);
