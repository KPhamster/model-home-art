/**
 * Spam check for the site's forms.
 *
 * Asks Jev, TypeSafe AI's decision model, one yes/no question about a submission and
 * gets back the probability that it is spam. API reference: https://docs.typesafe.ai/api
 * It is switched on by setting TYPESAFE_API_KEY in the environment.
 *
 * The filter never loses an enquiry through a fault of its own: with no API key, on a
 * timeout or on any error, the submission counts as "unchecked" and is handled exactly
 * as it was before the filter existed.
 */

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";
const TIMEOUT_MS = 4000;
const MAX_FIELD_LENGTH = 4000;

/** At or above this probability a submission is held: saved, but no emails go out. */
const HOLD_AT = 0.85;
/** From here up to HOLD_AT the shop is still emailed, with a warning in the subject. */
const WARN_AT = 0.5;

export type SpamCheck =
  | { status: "ok" | "suspect" | "spam"; probability: number }
  | { status: "unchecked"; probability: null };

const UNCHECKED: SpamCheck = { status: "unchecked", probability: null };

/**
 * @param form   which form this came from, in plain words ("contact form")
 * @param fields what the visitor typed. Pass text fields only: email addresses and
 *               phone numbers are not needed to judge spam, so they are not sent.
 */
export async function checkForSpam(form: string, fields: Record<string, unknown>): Promise<SpamCheck> {
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) return UNCHECKED;

  const submission: Record<string, string> = {};
  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === "string" && value.trim()) {
      submission[name] = value.trim().slice(0, MAX_FIELD_LENGTH);
    }
  }
  if (Object.keys(submission).length === 0) return UNCHECKED;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        state: {
          website: "Model Home Art, a custom picture framing shop in Orange County, California",
          form,
          submission,
        },
        questions: {
          spam: {
            type: "noul",
            instructions:
              "This submission is spam: it was not written by someone with a genuine interest in the shop's framing services or products.",
            criteria: {
              true: "Unsolicited selling or marketing (SEO, web design, lead generation, loans, crypto, adult or pharmacy offers), mass-mailed pitches, scams, link drops, gibberish or keyboard mashing, or text that has nothing to do with framing, artwork or the shop.",
              false:
                "A person asking about framing, artwork, photos, jerseys, mirrors, prices, opening hours, delivery, an order or a visit. Still genuine if it is very short, vague, misspelt or not in English.",
            },
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`Spam check skipped: Jev answered ${response.status}`);
      return UNCHECKED;
    }

    const data = await response.json();
    const probability: unknown = data?.answers?.spam?.noul;
    if (typeof probability !== "number" || !(probability >= 0 && probability <= 1)) {
      console.error("Spam check skipped: Jev's answer had no probability");
      return UNCHECKED;
    }

    const status = probability >= HOLD_AT ? "spam" : probability >= WARN_AT ? "suspect" : "ok";
    console.info(`Spam check (${form}): ${status}, ${percent(probability)} likely spam`);
    return { status, probability };
  } catch (error) {
    console.error("Spam check skipped:", error instanceof Error ? error.message : error);
    return UNCHECKED;
  }
}

const percent = (probability: number) => `${Math.round(probability * 100)}%`;

/** Saved with a held submission, so a wrongly held enquiry can still be found and answered. */
export function heldLabel(check: SpamCheck): string {
  return check.probability === null ? "" : `Held as spam ${percent(check.probability)}`;
}

/** Goes in front of the shop's notification subject when the filter was unsure. */
export function suspectPrefix(check: SpamCheck): string {
  return check.status === "suspect" ? `[Possible spam ${percent(check.probability)}] ` : "";
}
