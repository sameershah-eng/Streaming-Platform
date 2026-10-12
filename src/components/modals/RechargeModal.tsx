import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { stripeService } from '../../lib/stripe/client';

interface RechargeModalProps {
  onClose: () => void;
  onSuccess: (amount: number, description: string) => void;
  currentBalance: number;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  onClose,
  onSuccess,
  currentBalance,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card_8891' | 'card_4242' | 'new_card'>('card_8891');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'select' | 'processing' | 'confirmed'>('select');

  const presetAmounts = [50, 100, 250, 500];
  const finalAmount = customAmount ? parseFloat(customAmount) || selectedAmount : selectedAmount;

  const handleExecuteRecharge = async () => {
    if (finalAmount <= 0) return;
    setIsProcessing(true);
    setCheckoutStep('processing');

    try {
      await stripeService.createCheckoutSession({
        amountUsd: finalAmount,
        currency: 'usd',
        customerEmail: 'sameerupwork25@gmail.com',
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        metadata: {
          userId: 'usr_89502_prod',
          purpose: 'wallet_recharge',
        },
      });

      setIsProcessing(false);
      setCheckoutStep('confirmed');

      setTimeout(() => {
        onSuccess(
          finalAmount,
          `Wallet Recharge ($${finalAmount.toFixed(2)} USD via Stripe Checkout)`
        );
        onClose();
      }, 1200);
    } catch {
      setIsProcessing(false);
      setCheckoutStep('select');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Consultation Credits</h3>
              <p className="text-xs text-slate-500">Stripe Connect Checkout Simulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {checkoutStep === 'select' && (
            <>
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Recharge Package (USD)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold font-mono transition-all tabular-nums ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 block">Or enter custom amount:</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Payment Method (Tokenized via Stripe Elements)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === 'card_8891'}
                        onChange={() => setSelectedPaymentMethod('card_8891')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Visa ending in 8891</p>
                        <p className="text-[11px] text-slate-400">Expires 08/29 · Default</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Stripe Vault</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === 'card_4242'}
                        onChange={() => setSelectedPaymentMethod('card_4242')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Mastercard ending in 4242</p>
                        <p className="text-[11px] text-slate-400">Expires 11/28 · Verified</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Stripe Vault</span>
                  </label>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">New Resulting Balance:</span>
                  <p className="font-mono text-slate-900 text-sm font-bold tabular-nums">
                    ${(currentBalance + finalAmount).toFixed(2)} USD
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Charge Total:</span>
                  <p className="font-mono text-indigo-600 text-sm font-bold tabular-nums">
                    ${finalAmount.toFixed(2)} USD
                  </p>
                </div>
              </div>

              {/* Safe Demo Indicator Notice */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Simulated Stripe test mode. No actual debit occurs on real credit cards.</span>
              </div>
            </>
          )}

          {checkoutStep === 'processing' && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-900">Creating Stripe PaymentIntent...</p>
              <p className="text-xs text-slate-500">
                Verifying webhook signature &amp; appending ledger transaction
              </p>
            </div>
          )}

          {checkoutStep === 'confirmed' && (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Payment Succeeded!</p>
              <p className="text-xs text-slate-500">
                Added ${finalAmount.toFixed(2)} USD to your balance. Updating wallet ledger...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {checkoutStep === 'select' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteRecharge}
              disabled={isProcessing || finalAmount <= 0}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <span>Authorize &amp; Fund ${finalAmount.toFixed(2)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
