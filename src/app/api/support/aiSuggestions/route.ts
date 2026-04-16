
// go to google write- gemini api key //

import { NextRequest, NextResponse } from "next/server";


const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";


export async function POST(req: NextRequest) {
    try {
        const { message, role, targetRole } = await req.json();
        if (!message || !role || !targetRole) {
            return NextResponse.json({ suggestions: [] })
        }

        const roleMatrix: Record<string, string> = {
            "user_vendor": `
            You are replying as a USER to VENDOR.


            GOAL:
            Request hepl for clarification:

            RULES:
            -Clearly explain the issue or request
            -Be polite and respectful
            -Do not sound demanding and accusatory
            -Do not purpose solutions yourself
            -Ask only what is neccessary
            `,

            "vendor_user": `
             You are replying as a VENDOR to USER.

             GOAL:
             Assist the user professionally.

             RULES:
             -Be solution-oriented
             -Acknowledge the user's concern
             -Avoid blaming the user
             -Do not overpromise timelines or refunds
             -Ask for details only if required
            `,

            "vendor_admin": `
            You are replying as a VENDOR to ADMIN.

            GOAL:
            Escalate or clarify an issue.

           RULES:
           -Be factual and concise
           -Clearly state the problem
           -Include relevant technical or operational context
           -Avoid emotional language
           `,

            "admin_vendor": `
             You are replying as a ADMIN to VENDOR.

            GOAL:
            Resolve or guide.

           RULES:
           -Be authortivate but fair
           -Requset missing information if needed
           -Provide clear next step when possible
           -Avoid unneccessary explanations
           `
        };

        const roleKey = `${role}_${targetRole}`;
        const roleContext = roleMatrix[roleKey] || "";


        const prompt = `
        You are an AI assistant specialized in short, professional support replies.

        ROLE & CONTEXT:
        ${roleContext}


        CONVERSATION CONTEXT:
        The last message you received is:
        "${message}"

        OBJECTIVE:
        Generate exactly THREE  reply suggestions that are suitable for sending directly to     the other party.

        STRICT OUTPUT RULES:
        -No emojis
        -No explanations
        -No numbering or bullet points
        -Do not repeat the same sentence structure
        -Each reply must be on a new line
        -Do not include quotes around replies
        -Avoid overly generic phrases

        QUALITY RULES:
        -Reply must logically respond to the message
        -Sound human, not robotic
        -Keep tone polite and professional
        -Keep responses concise (1-2 sentences max)
        -Ensure clarity and completeness
        -Avoid slang and informal abbreviations
        -Adapt tone based on context (formal/informal)
        -Do not ask unnecessary questions
        -Offer helpful or actionable content when appropriate

        OUTPUT FORMAT:
        Plan text only.
        Exactly three lines.
        `;

        const geminiResponse = await fetch(
            `${geminiUrl}?key=${process.env.GEMINI_API_KEY}`,

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await geminiResponse.json();

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // modufity text here //
        const suggestions = text
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 3);

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.log("Suggestions error", error)
        return NextResponse.json({ suggestions: [] })
    }
}