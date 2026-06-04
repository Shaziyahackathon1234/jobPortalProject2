import OpenAI from "openai";

// Pull a clean domain (no protocol / www / path) out of a URL or loose string.
const extractDomain = (url) => {
    if (!url) return null;
    try {
        let s = String(url).trim().toLowerCase();
        if (!/^https?:\/\//.test(s)) s = "https://" + s;
        const host = new URL(s).hostname.replace(/^www\./, "");
        return host.includes(".") ? host : null;
    } catch {
        return null;
    }
};

// A generated initials avatar — always valid, never a broken image.
const initialsAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Company"
    )}&background=6A38C2&color=fff&bold=true&size=128`;

// Ask the LLM to map a company name -> its primary website domain.
const guessDomainFromName = async (name) => {
    if (!name || !process.env.GROQ_API_KEY) return null;
    try {
        const groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You map a company name to its primary official website domain.
Return ONLY JSON: {"domain":"example.com"} — no protocol, no www, no path.
If you are not reasonably confident the company exists, return {"domain":null}.`,
                },
                { role: "user", content: `Company name: ${name}` },
            ],
            response_format: { type: "json_object" },
        });
        const parsed = JSON.parse(response.choices[0].message.content);
        return extractDomain(parsed?.domain);
    } catch (error) {
        console.error("Logo domain guess failed:", error.message);
        return null;
    }
};

// Best-effort logo URL for a company that has no uploaded logo.
// Prefers the real brand logo (logo.dev, via the website or an AI-guessed
// domain) and falls back to a generated initials avatar.
//
// LOGODEV_TOKEN is a logo.dev "publishable" token — safe to embed in public
// image URLs. Get a free one at https://www.logo.dev and set it on Render.
export const resolveCompanyLogo = async (name, website) => {
    const domain = extractDomain(website) || (await guessDomainFromName(name));
    const token = process.env.LOGODEV_TOKEN;

    if (domain && token) {
        // logo.dev returns the real brand logo, or a clean monogram if it has
        // no logo for that domain — so this is always a valid image.
        return `https://img.logo.dev/${domain}?token=${token}&size=128&format=png&retina=true`;
    }

    if (domain && !token) {
        console.warn("LOGODEV_TOKEN not set — falling back to initials avatar.");
    }
    return initialsAvatar(name);
};
