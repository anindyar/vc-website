export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const { name, email, company, servers, message } = body;

    if (!name || !email || !company) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and company are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Airtable configuration
    const AIRTABLE_API_KEY = env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = 'app1lloN9OOQTi7cJ';
    const AIRTABLE_TABLE_ID = env.AIRTABLE_ENTERPRISE_TABLE_ID || 'tblENTERPRISE'; // Set this in Cloudflare env

    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create record in Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Name': name,
                'Email': email,
                'Company': company,
                'Servers': servers || '',
                'Message': message || '',
              },
            },
          ],
        }),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error('Airtable error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save request' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Request submitted successfully!' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Enterprise signup error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
