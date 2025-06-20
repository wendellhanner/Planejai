import { type NextRequest, NextResponse } from 'next/server';
import { getWhatsAppIntegration, handleWhatsAppWebhook } from '@/lib/whatsapp';

// GET /api/webhooks/whatsapp
// This endpoint is used for webhook verification by the WhatsApp Business API
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Get the WhatsApp integration settings
    const integration = await getWhatsAppIntegration();

    // Check if token matches our verification token
    if (mode === 'subscribe' && token === integration?.webhookVerifyToken) {
      // Respond with the challenge token from the request
      console.log('Webhook verified successfully');
      return new NextResponse(challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.error('Webhook verification failed');
      return new NextResponse('Verification token mismatch', {
        status: 403,
      });
    }
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/webhooks/whatsapp
// This endpoint receives incoming messages and events from WhatsApp
export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Log the received payload
    console.log('Received webhook from WhatsApp:', JSON.stringify(body));

    // Handle the webhook payload
    const result = await handleWhatsAppWebhook(body);

    if (result.success) {
      // WhatsApp API expects a 200 OK response
      return NextResponse.json({ status: 'ok' });
    } else {
      console.error('Error handling webhook:', result.error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
