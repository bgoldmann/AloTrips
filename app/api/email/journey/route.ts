import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, generateEmailTemplate } from '@/lib/email/service';

/**
 * Email Journey API - Manages email triggers and tracking
 * Based on PRD Phase 3 requirements
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      triggerType,
      triggerData,
    } = body;

    if (!userId || !triggerType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, triggerType' },
        { status: 400 }
      );
    }

    const validTriggerTypes = [
      'welcome',
      'search_abandoned',
      'price_drop',
      'trip_reminder',
      'post_booking',
      'review_request',
      'reengagement',
    ];

    if (!validTriggerTypes.includes(triggerType)) {
      return NextResponse.json(
        { error: `Invalid triggerType. Must be one of: ${validTriggerTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create email trigger
    const { data, error } = await (supabase
      .from('email_journey_triggers') as any)
      .insert({
        user_id: userId,
        trigger_type: triggerType,
        trigger_data: triggerData || {},
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create email trigger' },
        { status: 500 }
      );
    }

    // Get user email from user record
    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    // Send email if user email exists
    if (userData?.email) {
      const emailTemplate = generateEmailTemplate(triggerType, triggerData || {});
      
      try {
        const emailResult = await sendEmail({
          to: userData.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });

        if (emailResult.success) {
          // Update trigger with email sent status
          await supabase
            .from('email_journey_triggers')
            .update({
              email_sent: true,
              email_sent_at: new Date().toISOString(),
              status: 'sent',
            })
            .eq('id', data.id);
        } else {
          // Update trigger with failed status
          await supabase
            .from('email_journey_triggers')
            .update({
              status: 'failed',
            })
            .eq('id', data.id);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Update trigger with failed status
        await supabase
          .from('email_journey_triggers')
          .update({
            status: 'failed',
          })
          .eq('id', data.id);
      }
    }

    return NextResponse.json({
      trigger: data,
      message: 'Email trigger created and email sent.',
    });
  } catch (error) {
    console.error('Email journey API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const triggerType = searchParams.get('triggerType');
    const status = searchParams.get('status');

    let query = supabase
      .from('email_journey_triggers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (triggerType) {
      query = query.eq('trigger_type', triggerType);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching email triggers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email triggers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ triggers: data || [] });
  } catch (error) {
    console.error('Email journey GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, emailSent, emailOpened, emailClicked, status: newStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: any = {};
    if (emailSent !== undefined) {
      updateData.email_sent = emailSent;
      if (emailSent) {
        updateData.email_sent_at = new Date().toISOString();
      }
    }
    if (emailOpened !== undefined) {
      updateData.email_opened = emailOpened;
      if (emailOpened) {
        updateData.email_opened_at = new Date().toISOString();
      }
    }
    if (emailClicked !== undefined) {
      updateData.email_clicked = emailClicked;
      if (emailClicked) {
        updateData.email_clicked_at = new Date().toISOString();
      }
    }
    if (newStatus) {
      updateData.status = newStatus;
    }

    const { data, error } = await (supabase
      .from('email_journey_triggers') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update email trigger' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trigger: data });
  } catch (error) {
    console.error('Email journey PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

