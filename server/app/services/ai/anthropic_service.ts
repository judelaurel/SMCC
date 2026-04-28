import OpenAI from 'openai';
import env from '#start/env';

export type SupportedPlatform =
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'mastodon';
export type ToneOfVoice = 'professional' | 'casual' | 'witty' | 'formal';

export interface GeneratePostPayload {
  topic: string;
  platform: SupportedPlatform;
  toneOfVoice: ToneOfVoice;
  keywords: string[];
  brandName?: string;
  brandDescription?: string;
}

export interface PostVariation {
  id: number;
  content: string;
  characterCount: number;
}

const PLATFORM_RULES: Record<SupportedPlatform, string> = {
  instagram: `
- Max 2 200 characters (aim for 150–300 for best engagement)
- Use line breaks for readability
- Include 5–10 relevant hashtags at the end
- Add 1–3 fitting emojis naturally within the text
- Conversational and visually descriptive tone`,

  twitter: `
- Hard limit: 280 characters including spaces
- Be punchy and direct — one clear idea per tweet
- Include 1–2 hashtags maximum (do not pad with hashtags)
- Optionally one emoji
- Hook the reader in the first 5 words`,

  linkedin: `
- Optimal length: 600–1 300 characters
- Start with a bold hook sentence (no greetings like "I'm excited to share")
- Use short paragraphs (2–3 lines each) with blank lines between them
- Include a question or call-to-action at the end
- Professional but human; NO excessive hashtags (2–3 max at end)`,

  mastodon: `
- Max 500 characters
- Community-first, authentic and non-promotional tone
- Hashtags are used for discovery: 2–4 well-chosen ones
- No algorithm-gaming; write for people not reach
- Emojis are fine but not overdone`,
};

const TONE_DESCRIPTORS: Record<ToneOfVoice, string> = {
  professional:
    'authoritative, clear and polished — conveys expertise without jargon',
  casual:
    'friendly, relaxed and approachable — like talking to a knowledgeable friend',
  witty:
    'clever. sharp and entertaining — uses wordplay, irony or unexpected angles',
  formal:
    'structured, precise and respectful — appropriate for official communications',
};

export class AnthropicService {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      // apiKey: 'ollama',
      apiKey: env.get('OLLAMA_API_KEY'),
      baseURL: `${env.get('OLLAMA_BASE_URL')}/v1`,
    });
    this.model = env.get('OLLAMA_MODEL');
  }

  async generatePostVariations(
    payload: GeneratePostPayload,
  ): Promise<PostVariation[]> {
    const platformRules = PLATFORM_RULES[payload.platform];
    const toneDesc = TONE_DESCRIPTORS[payload.toneOfVoice];
    const brandCtx = payload.brandName
      ? `\nBrand: "${payload.brandName}"${payload.brandDescription ? ` — ${payload.brandDescription}` : ''}`
      : '';

    const systemPrompt = `You are a professional social media copywriter.
Your job is to write ${payload.platform} posts that perform well.${brandCtx}

Platform rules for ${payload.platform}:${platformRules}

Tone of voice: ${payload.toneOfVoice} — ${toneDesc}

IMPORTANT: Always respond with ONLY a valid JSON object in this exact shape — no markdown fences, no extra text:
{
  "variations": [
    { "id": 1, "content": "full post text here" },
    { "id": 2, "content": "full post text here" },
    { "id": 3, "content": "full post text here" }
  ]
}`;

    const userPrompt = `Write 3 distinct ${payload.platform} post variations about the following topic.

Topic: ${payload.topic}
Keywords to incorporate naturally: ${payload.keywords.join(', ')}

Each variation should take a noticeably different angle or structure. Do not number them in the content itself.`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? '';

    const parsed = this.parseVariations(raw);
    return parsed;
  }

  private parseVariations(raw: string): PostVariation[] {
    // Strip ```json fences just in case the model ignores instructions
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let data: { variations: { id: number; content: string }[] };
    try {
      data = JSON.parse(cleaned);
    } catch {
      throw new Error('AI returned an unparseable response. Please try again.');
    }

    if (!Array.isArray(data.variations) || data.variations.length === 0) {
      throw new Error('AI returned no variations. Please try again.');
    }

    return data.variations.map(v => ({
      id: v.id,
      content: v.content,
      characterCount: v.content.length,
    }));
  }
}

export const anthropicService = new AnthropicService();
