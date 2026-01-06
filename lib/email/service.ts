/**
 * Email Service Integration
 * Supports SendGrid, Mailchimp, and other email service providers
 * Based on PRD Phase 3 requirements
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export type EmailProvider = 'sendgrid' | 'mailchimp' | 'console' | 'none';

/**
 * Get email provider from environment variables
 */
function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase();
  
  if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
    return 'sendgrid';
  }
  
  if (provider === 'mailchimp' && process.env.MAILCHIMP_API_KEY) {
    return 'mailchimp';
  }
  
  // Default to console logging in development
  if (process.env.NODE_ENV === 'development') {
    return 'console';
  }
  
  return 'none';
}

/**
 * Send email via SendGrid
 */
async function sendViaSendGrid(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'SENDGRID_API_KEY not configured',
    };
  }

  try {
    // SendGrid API v3
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: {
          email: options.from || process.env.EMAIL_FROM || 'noreply@alotrips.me',
          name: options.fromName || 'AloTrips',
        },
        reply_to: options.replyTo ? { email: options.replyTo } : undefined,
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
          ...(options.text ? [{
            type: 'text/plain',
            value: options.text,
          }] : []),
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `SendGrid API error: ${response.status} ${errorText}`,
      };
    }

    // SendGrid returns message ID in X-Message-Id header
    const messageId = response.headers.get('X-Message-Id');

    return {
      success: true,
      messageId: messageId || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email via Mailchimp (Mandrill)
 */
async function sendViaMailchimp(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'MAILCHIMP_API_KEY not configured',
    };
  }

  try {
    // Extract server prefix from API key (e.g., "us1" from "xxx-us1")
    const serverPrefix = apiKey.split('-').pop() || 'us1';
    
    const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'regular',
        recipients: {
          list_id: process.env.MAILCHIMP_LIST_ID || '',
        },
        settings: {
          subject_line: options.subject,
          from_name: options.fromName || 'AloTrips',
          reply_to: options.from || process.env.EMAIL_FROM || 'noreply@alotrips.me',
        },
      }),
    });

    // Note: Mailchimp requires creating campaigns and sending separately
    // This is a simplified implementation - in production, use Mailchimp Transactional API (Mandrill)
    // or Mailchimp Marketing API properly
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Mailchimp API error: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.id?.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Console logger for development (no actual email sent)
 */
async function sendViaConsole(options: EmailOptions): Promise<EmailResult> {
  console.log('=== EMAIL (Development Mode) ===');
  console.log('To:', options.to);
  console.log('Subject:', options.subject);
  console.log('From:', options.from || process.env.EMAIL_FROM || 'noreply@alotrips.me');
  console.log('HTML:', options.html.substring(0, 200) + '...');
  console.log('================================');
  
  return {
    success: true,
    messageId: `dev-${Date.now()}`,
  };
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const provider = getEmailProvider();

  switch (provider) {
    case 'sendgrid':
      return sendViaSendGrid(options);
    
    case 'mailchimp':
      return sendViaMailchimp(options);
    
    case 'console':
      return sendViaConsole(options);
    
    case 'none':
    default:
      return {
        success: false,
        error: 'Email service not configured. Set EMAIL_PROVIDER and API keys in environment variables.',
      };
  }
}

/**
 * Generate email templates for journey triggers
 */
export function generateEmailTemplate(triggerType: string, data: any): { subject: string; html: string; text: string } {
  switch (triggerType) {
    case 'welcome':
      return {
        subject: 'Welcome to AloTrips!',
        html: `
          <h1>Welcome to AloTrips!</h1>
          <p>Thank you for signing up. Start searching for the best travel deals today.</p>
          <p><a href="https://alotrips.me">Explore Destinations</a></p>
        `,
        text: 'Welcome to AloTrips! Thank you for signing up. Start searching for the best travel deals today.',
      };

    case 'search_abandoned':
      return {
        subject: 'Continue your search on AloTrips',
        html: `
          <h1>Don't miss out on great deals!</h1>
          <p>We noticed you were searching for ${data.destination || 'travel deals'}. Continue your search to find the best prices.</p>
          <p><a href="https://alotrips.me?destination=${encodeURIComponent(data.destination || '')}">Continue Searching</a></p>
        `,
        text: `Don't miss out on great deals! Continue your search for ${data.destination || 'travel deals'}.`,
      };

    case 'price_drop':
      return {
        subject: `Price drop: ${data.route || 'Your saved trip'}`,
        html: `
          <h1>Great news! Prices have dropped</h1>
          <p>The price for ${data.route || 'your saved trip'} has dropped by ${data.percentDrop || '10'}%.</p>
          <p><a href="https://alotrips.me/${data.link || ''}">View Deal</a></p>
        `,
        text: `Great news! Prices have dropped for ${data.route || 'your saved trip'}.`,
      };

    case 'trip_reminder':
      return {
        subject: `Your trip is coming up!`,
        html: `
          <h1>Your trip is approaching</h1>
          <p>Your trip to ${data.destination || 'your destination'} is in ${data.daysUntil || '7'} days.</p>
          <p><a href="https://alotrips.me/trips">View Trip Details</a></p>
        `,
        text: `Your trip to ${data.destination || 'your destination'} is in ${data.daysUntil || '7'} days.`,
      };

    case 'post_booking':
      return {
        subject: 'Thank you for your booking!',
        html: `
          <h1>Booking Confirmed</h1>
          <p>Thank you for booking with AloTrips. Your trip details are below.</p>
          <p><a href="https://alotrips.me/bookings">View Booking</a></p>
        `,
        text: 'Thank you for booking with AloTrips. Your booking is confirmed.',
      };

    case 'review_request':
      return {
        subject: 'How was your trip?',
        html: `
          <h1>Share your experience</h1>
          <p>We'd love to hear about your trip to ${data.destination || 'your destination'}.</p>
          <p><a href="https://alotrips.me/reviews">Leave a Review</a></p>
        `,
        text: `We'd love to hear about your trip to ${data.destination || 'your destination'}.`,
      };

    case 'reengagement':
      return {
        subject: 'We miss you on AloTrips',
        html: `
          <h1>Come back and explore</h1>
          <p>Discover new destinations and great deals on AloTrips.</p>
          <p><a href="https://alotrips.me">Explore Now</a></p>
        `,
        text: 'Discover new destinations and great deals on AloTrips.',
      };

    default:
      return {
        subject: 'AloTrips Update',
        html: '<p>Hello from AloTrips!</p>',
        text: 'Hello from AloTrips!',
      };
  }
}

