import { NextRequest, NextResponse } from "next/server";

// M Coding business context for the AI
const SYSTEM_PROMPT = `You are the AI assistant for M Coding Ireland - Ireland's first complete BMW & MINI specialist located in Ardfinnan, Co. Tipperary, E91YX50.

## About M Coding
- BMW Registered specialist since 2019
- Services: Servicing, Coding, Performance Remapping, OEM Retrofitting
- Contact: 087 609 6830, mcodingireland@gmail.com
- Hours: Monday-Friday 10:00 AM - 6:00 PM (Closed Saturday & Sunday)
- Note: Phone calls and messages may be missed during lunch break (1:00 PM - 2:00 PM)

## Availability
- We are usually booked up roughly 2 weeks in advance
- When asked about availability, ask the customer to provide more details about what service they need
- We can then come back with a suitable appointment depending on the service required

## Apple CarPlay Eligibility (IMPORTANT)
- Only BMW vehicles from 2017 onwards support native Apple CarPlay activation
- Some 2015/2016 models MIGHT be eligible, but this needs to be checked
- NO models before 2015 can have CarPlay activated - this is not possible
- The vehicle must have NBT EVO iDrive system (ID4, ID5, or ID6)
- Standard NBT or CIC systems cannot have CarPlay activated
- Direct customers to our blog guide: https://m-coding.ie/blog/bmw-idrive-systems-guide

## How to Check iDrive Version (Help customers find this)
1. Navigate to Main Menu
2. Select Navigation
3. Push controller to the left and select Maps
4. Press Options button on the controller
5. Scroll down to "Navigation system version"
6. Check the version number shown

What to look for:
- If it shows "NBT_EVO_..." → They have NBT EVO (ID4, ID5, or ID6) - CarPlay IS possible
- If it shows "NEXT" or just "NBT" → They have standard NBT - CarPlay is NOT possible

## Services & Pricing

### Coding Services:
- Apple CarPlay Activation: €120 (NBT EVO systems only, wireless, ~30 mins)
- Region Change: From €250 (CIC €350, NBT €250, NBT EVO €350, MGU €550, ID8 €600, ID8.5 €1500)
- Speed Limit Info (SLI): €170-€200

### Performance:
- XHP Transmission Remap: From €219 (6-speed €219, 7-speed DCT €399, 8-speed €299, 8-speed G/Supra €399)
- ECU Remapping: Price on application

### Servicing:
- ZF Transmission Service: From €550
- Intake Manifold Cleaning/Walnut Blasting: From €285
- Petrol Fuel Injector Cleaning: €120 (4 injectors), €160 (6 injectors)

### Retrofitting:
- BMW Genuine Reversing Camera: From €450
- Ambient Lighting F10/F11: €250-€390
- BMW G3X LCI Taillights: €1250-€1350
- BMW F1X Headlight Repair: From €299

## Response Guidelines:
1. Be friendly, professional, and helpful
2. Keep responses concise but informative
3. Always provide specific pricing when available
4. For complex queries or bookings, suggest WhatsApp contact
5. Use bullet points for lists
6. Don't use emojis excessively (1-2 max per response)
7. If unsure, recommend contacting via WhatsApp for accurate info
8. Mention location (Ardfinnan, Tipperary) when relevant
9. Highlight that M Coding is BMW Registered when discussing quality/trust
10. For CarPlay queries, ALWAYS check vehicle year and explain eligibility`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback to rule-based responses if no API key
      return NextResponse.json({
        response: getFallbackResponse(message),
        source: "fallback"
      });
    }

    // Build conversation messages
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(conversationHistory || []).slice(-6), // Keep last 6 messages for context
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json({
        response: getFallbackResponse(message),
        source: "fallback"
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || getFallbackResponse(message);

    return NextResponse.json({
      response: aiResponse,
      source: "ai"
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: "I apologize, but I'm having trouble processing your request. Please try again or contact us via WhatsApp at 087 609 6830.",
      source: "error"
    });
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
    return `Here are some of our popular services:

• Apple CarPlay Activation - €120
• Region Change - From €250
• XHP Transmission Remap - From €219
• ZF Transmission Service - From €550
• Injector Cleaning - From €120

For a specific quote, please contact us via WhatsApp at 087 609 6830!`;
  }

  if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("address")) {
    return `We're located in Ardfinnan, Co. Tipperary, E91YX50, Ireland.

Opening Hours:
Monday - Friday: 10:00 AM - 6:00 PM
Saturday & Sunday: Closed

Note: Phone calls and messages may be missed during lunch (1:00 PM - 2:00 PM).

We serve customers from all over Ireland!`;
  }

  if (lowerMessage.includes("availability") || lowerMessage.includes("available") || lowerMessage.includes("when can") || lowerMessage.includes("next slot") || lowerMessage.includes("how soon")) {
    return `We are usually booked up roughly 2 weeks in advance.

To find a suitable appointment, please let us know:
• What service do you need?
• What BMW/MINI model do you have?
• Any preferred dates?

Once we have these details, we can come back with available appointment options!`;
  }

  if (lowerMessage.includes("hours") || lowerMessage.includes("open") || lowerMessage.includes("close")) {
    return `Our Opening Hours:

Monday - Friday: 10:00 AM - 6:00 PM
Saturday & Sunday: Closed

Note: Phone calls and messages may be missed during our lunch break (1:00 PM - 2:00 PM).

Contact us via WhatsApp at 087 609 6830 for the fastest response!`;
  }

  if (lowerMessage.includes("book") || lowerMessage.includes("appointment")) {
    return `To book an appointment, you can:

1. WhatsApp us at 087 609 6830 (fastest)
2. Fill out our contact form on the website
3. Email: mcodingireland@gmail.com

We typically respond within minutes during business hours!`;
  }

  if (lowerMessage.includes("carplay") || lowerMessage.includes("car play") || lowerMessage.includes("apple play")) {
    return `Apple CarPlay Activation - €120

**Eligibility:**
• Vehicles from 2017 onwards with NBT EVO iDrive - YES
• Some 2015/2016 models may be eligible - needs checking
• Vehicles before 2015 - NOT possible

**How to check your iDrive version:**
1. Go to Main Menu → Navigation → Maps
2. Press Options on the controller
3. Select "Navigation system version"
4. If it shows "NBT_EVO_..." → CarPlay IS possible
5. If it shows "NEXT" or "NBT" → CarPlay is NOT possible

Read our full guide: https://m-coding.ie/blog/bmw-idrive-systems-guide

Not sure? Send us your vehicle year and model on WhatsApp and we'll confirm!`;
  }

  if (lowerMessage.includes("idrive") || lowerMessage.includes("i drive") || lowerMessage.includes("which system") || lowerMessage.includes("what system")) {
    return `**How to check your iDrive version:**

1. Navigate to Main Menu
2. Select Navigation
3. Push controller left → select Maps
4. Press Options button
5. Scroll to "Navigation system version"

**What to look for:**
• "NBT_EVO_..." → NBT EVO (ID4/ID5/ID6) - CarPlay possible
• "NEXT" or "NBT" → Standard NBT - CarPlay NOT possible

Read our complete iDrive guide: https://m-coding.ie/blog/bmw-idrive-systems-guide

Need help? Send us your vehicle details on WhatsApp at 087 609 6830!`;
  }

  return `Thanks for your message! I can help with:

• Services & pricing information
• Booking appointments
• Location & opening hours
• Product details

For the most accurate information, you can also reach us directly via WhatsApp at 087 609 6830.`;
}
