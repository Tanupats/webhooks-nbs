import Stripe from "stripe";
import { stripe } from "./stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req: Request) {

    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRITE_WEBHOOKS
        )
        console.log('event', event)
    } catch (error) {
        return new NextResponse("invalid signature", { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;
    console.log('session', session);
    if (event.type === "payment_intent.succeeded") {
        console.log('Payment success')
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        console.log('Payment Intent:', paymentIntent);

    }
    return new NextResponse("ok", { status: 200 })
}

