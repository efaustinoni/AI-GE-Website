import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubmissionRecord {
  id: number;
  kind: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message?: string;
  tool_name?: string;
  target_url?: string;
  environment?: string;
  urgency?: string;
  consent?: boolean;
  privacy?: boolean;
  ip?: string;
  user_agent?: string;
  created_at: string;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: SubmissionRecord;
}

function buildEmailSubject(kind: string): string {
  if (kind === "security-scan" || kind === "security_scan") {
    return "🔒 New Security Scan Request";
  }
  return "📧 New Contact Form Submission";
}

function buildEmailHtml(record: SubmissionRecord): string {
  const isSecurityScan = record.kind === "security-scan" || record.kind === "security_scan";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: 600;
            color: #555;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .field-value {
            background: white;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #667eea;
            font-size: 15px;
          }
          .message-box {
            background: white;
            padding: 15px;
            border-radius: 4px;
            border-left: 3px solid #667eea;
            white-space: pre-wrap;
            font-size: 15px;
          }
          .metadata {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            font-size: 12px;
            color: #777;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            background: #667eea;
            color: white;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${isSecurityScan ? "🔒 Security Scan Request" : "📧 Contact Form Submission"}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Submission #${record.id}</p>
        </div>

        <div class="content">
          <div class="field">
            <div class="field-label">Submission Type</div>
            <div class="field-value">
              <span class="badge">${record.kind}</span>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${record.name}</div>
          </div>

          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value">
              <a href="mailto:${record.email}" style="color: #667eea; text-decoration: none;">${record.email}</a>
            </div>
          </div>

          ${record.phone ? `
          <div class="field">
            <div class="field-label">Phone</div>
            <div class="field-value">
              <a href="tel:${record.phone}" style="color: #667eea; text-decoration: none;">${record.phone}</a>
            </div>
          </div>
          ` : ''}

          ${record.company ? `
          <div class="field">
            <div class="field-label">Company</div>
            <div class="field-value">${record.company}</div>
          </div>
          ` : ''}

          ${isSecurityScan && record.tool_name ? `
          <div class="field">
            <div class="field-label">AI Tool Name</div>
            <div class="field-value">${record.tool_name}</div>
          </div>
          ` : ''}

          ${isSecurityScan && record.target_url ? `
          <div class="field">
            <div class="field-label">Target URL</div>
            <div class="field-value">
              <a href="${record.target_url}" style="color: #667eea; text-decoration: none;">${record.target_url}</a>
            </div>
          </div>
          ` : ''}

          ${isSecurityScan && record.environment ? `
          <div class="field">
            <div class="field-label">Environment</div>
            <div class="field-value">${record.environment}</div>
          </div>
          ` : ''}

          ${isSecurityScan && record.urgency ? `
          <div class="field">
            <div class="field-label">Urgency Level</div>
            <div class="field-value">
              <span class="badge" style="background: ${record.urgency === 'urgent' ? '#dc2626' : record.urgency === 'high' ? '#ea580c' : '#667eea'};">
                ${record.urgency}
              </span>
            </div>
          </div>
          ` : ''}

          ${record.message ? `
          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">${record.message}</div>
          </div>
          ` : ''}

          <div class="metadata">
            <div><strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'long'
            })}</div>
            ${record.ip ? `<div><strong>IP Address:</strong> ${record.ip}</div>` : ''}
            ${record.user_agent ? `<div><strong>User Agent:</strong> ${record.user_agent}</div>` : ''}
            ${record.consent ? `<div>✅ Consented to data processing</div>` : ''}
            ${record.privacy ? `<div>✅ Accepted privacy policy</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: WebhookPayload = await req.json();

    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    if (payload.type !== "INSERT" || payload.table !== "submissions") {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const record = payload.record;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("RECIPIENT_EMAIL") || "info@aiglobalexperts.com";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const subject = buildEmailSubject(record.kind);
    const html = buildEmailHtml(record);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AI Global Experts <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: subject,
        html: html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: resendData
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Email sent successfully for submission #${record.id}:`, resendData);

    return new Response(
      JSON.stringify({
        success: true,
        submissionId: record.id,
        emailId: resendData.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});