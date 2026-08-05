import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  merchant: { type: String, required: true },
  status: { type: String, enum: ['active', 'dormant', 'cancelled'], default: 'active' },
  cancelledAt: { type: Date },
  notes: { type: String }
});

SubscriptionSchema.set('toJSON', {
  transform: function(doc: any, ret: any, options: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
