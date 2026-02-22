import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface PaymentFormProps {
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export const PaymentForm = ({ amount, onSuccess, onCancel }: PaymentFormProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setProcessing(true)
        setError(null)

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href, // In extension, we might strictly handle via JS promise
            },
            redirect: 'if_required'
        });

        if (submitError) {
            setError(submitError.message || 'Payment failed')
            setProcessing(false)
        } else {
            // Payment succeeded
            onSuccess();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Secure Checkout</h3>

            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <PaymentElement />
            </div>

            {error && (
                <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded border border-red-400/20">
                    {error}
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={processing}
                    className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 py-2 rounded-lg bg-lingo-green text-black font-bold hover:bg-lingo-green/90 transition-colors text-sm flex justify-center items-center"
                >
                    {processing ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        `Pay $${amount.toLocaleString()}`
                    )}
                </button>
            </div>
        </form>
    )
}
