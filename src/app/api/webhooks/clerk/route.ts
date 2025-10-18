import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  try {
    // Ensure we have a valid user ID
    if (!evt.data.id) {
      console.error('No user ID found in webhook event');
      return new Response('No user ID found', { status: 400 });
    }
    
    switch (eventType) {
      case 'user.created':
        // Debug: Log the full event data to see what Clerk sends
        console.log('User created event received:', {
          userId: evt.data.id,
          email: evt.data.email_addresses?.[0]?.email_address,
          publicMetadata: evt.data.public_metadata,
        });
        
        await convex.mutation(api.user.syncUser, {
          clerkId: evt.data.id,
          email: evt.data.email_addresses?.[0]?.email_address,
          isActive: true,
        });
        console.log('User created:', evt.data.id);
        break;
        
      case 'user.updated':
        await convex.mutation(api.user.syncUser, {
          clerkId: evt.data.id,
          email: evt.data.email_addresses?.[0]?.email_address,
          isActive: true,
        });
        console.log('User updated:', evt.data.id);
        break;
        
      case 'user.deleted':
        await convex.mutation(api.user.deleteUser, {
          clerkId: evt.data.id,
        });
        break;
        
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
} 