import { NextRequest, NextResponse } from "next/server";

// M Coding business context for the AI
const SYSTEM_PROMPT = `You are the AI assistant for M Coding Ireland - Ireland's first complete BMW & MINI specialist located in Ardfinnan, Co. Tipperary, E91YX50.

## Core Info
- BMW Registered specialist since 2019
- Contact: 087 609 6830, mcodingireland@gmail.com
- Hours: Monday-Friday 10:00 AM - 6:00 PM (Closed weekends)
- Usually booked 2 weeks in advance

## CRITICAL: BOOKING APPOINTMENTS
When someone wants to book, you need these 6 details. NEVER ask for something already provided in the conversation:

1. **Service** - What do they need? (oil change, CarPlay, remapping, etc.)
2. **Vehicle** - Model and year (e.g., BMW M4 2016)
3. **Registration** - Irish reg number (e.g., 161-T-234)
4. **Contact** - Phone number
5. **Date** - When they want to come
6. **Time** - Morning, afternoon, or specific time

IMPORTANT RULES:
- Read the ENTIRE conversation history before responding
- NEVER ask for information already given
- If they gave partial info (like "2016 M4 161T234"), extract BOTH vehicle AND reg from it
- Ask for 1-2 missing pieces at a time maximum
- When you have ALL 6 pieces, IMMEDIATELY output the booking format below

Once you have ALL 6 details, output this EXACT format:

{{BOOKING_READY}}
Service: [the service]
Vehicle: [model and year]
Registration: [reg number]
Contact: [phone]
Preferred Date: [date]
Preferred Time: [time]
{{/BOOKING_READY}}

Click the button below to send your booking request via WhatsApp!

## Services & Pricing

### Servicing:
- Oil Change/Minor Service: From €150
- Major Service: From €350
- ZF Transmission Service: From €550
- Intake Manifold Cleaning: From €285
- Injector Cleaning: €120 (4 cyl), €160 (6 cyl)

### Coding:
- Apple CarPlay: €120 (2017+ with NBT EVO only)
- Region Change: From €250
- Speed Limit Info: €170-€200

### Performance:
- XHP Transmission Remap: From €219
- ECU Remapping: Price on application

### Retrofitting:
- Reversing Camera: From €450
- Ambient Lighting: €250-€390

## CarPlay Eligibility
- 2017+ BMW with NBT EVO (ID4/ID5/ID6) = YES
- 2015-2016 = Maybe, needs checking
- Before 2015 = NOT possible

## Response Style
- Be friendly and conversational
- Keep responses short and helpful
- Don't repeat information
- Max 1-2 emojis per message
- Don't add unnecessary buttons or calls to action`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response: "I'm currently unavailable. Please contact us directly via WhatsApp at 087 609 6830 or email mcodingireland@gmail.com",
        source: "unavailable"
      });
    }

    // Build conversation messages with emphasis on not repeating
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(conversationHistory || []).slice(-12), // Keep more context
      { role: "user", content: message }
    ];

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
        temperature: 0.6, // Slightly lower for more consistent behavior
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json({
        response: "I'm having a moment - please try again or contact us via WhatsApp at 087 609 6830!",
        source: "error"
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({
        response: "I couldn't process that. Please try again or contact us via WhatsApp at 087 609 6830!",
        source: "error"
      });
    }

    return NextResponse.json({
      response: aiResponse,
      source: "ai"
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: "Something went wrong. Please contact us via WhatsApp at 087 609 6830 or email mcodingireland@gmail.com",
      source: "error"
    });
  }
}
