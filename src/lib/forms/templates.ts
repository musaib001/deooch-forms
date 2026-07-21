import type { Field } from "./schema";

export type FormTemplate = {
  slug: string;
  name: string;
  category: string;
  /** One sentence, shown on the gallery card and the detail page. */
  description: string;
  /** Theme slug from lib/forms/themes.ts. Omit for the default palette. */
  theme?: string;
  fields: Field[];
};

// Order is positional in the definition below, so it's filled in here rather
// than hand-numbered on every field.
type Spec = Omit<Field, "order" | "required"> & { required?: boolean };
const build = (specs: Spec[]): Field[] =>
  specs.map((s, i) => ({ required: false, ...s, order: i }));

// ponytail: a static array, not a database table. Templates change when we ship,
// not when a user clicks — move them into Postgres only if users get to author
// their own.
export const TEMPLATES: FormTemplate[] = [
  {
    slug: "contact-us",
    theme: "ocean",
    name: "Contact Us Form",
    category: "Contact",
    description:
      "Capture inquiries, questions, and feedback from your website in one place, so nothing gets lost in a shared inbox.",
    fields: build([
      { id: "name", type: "text", label: "Full name", required: true, placeholder: "Jane Doe" },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "phone", type: "phone", label: "Phone number" },
      {
        id: "subject",
        type: "select",
        label: "What is this about?",
        required: true,
        options: ["General question", "Sales", "Support", "Partnership", "Something else"],
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        required: true,
        placeholder: "Tell us how we can help…",
      },
    ]),
  },
  {
    slug: "appointment-request",
    theme: "default",
    name: "Appointment Request Form",
    category: "Healthcare",
    description:
      "Let clients book time with you — collect their details, the reason for the visit, and a preferred date in one pass.",
    fields: build([
      { id: "sec-details", type: "heading", label: "Appointment details" },
      { id: "date", type: "date", label: "Preferred date", required: true },
      {
        id: "time",
        type: "select",
        label: "Preferred time",
        required: true,
        options: ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–7pm)"],
      },
      {
        id: "reason",
        type: "textarea",
        label: "Reason for the appointment",
        placeholder: "A short description helps us allocate the right amount of time.",
      },
      { id: "sec-contact", type: "heading", label: "Contact information" },
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "phone", type: "phone", label: "Phone number", required: true },
      {
        id: "first-visit",
        type: "radio",
        label: "Is this your first visit?",
        required: true,
        options: ["Yes", "No"],
      },
    ]),
  },
  {
    slug: "event-registration",
    theme: "plum",
    name: "Online Event Registration Form",
    category: "Events",
    description:
      "Register attendees for a conference, workshop, or meetup — including ticket type, dietary needs, and accessibility requests.",
    fields: build([
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "organisation", type: "text", label: "Company or organisation" },
      {
        id: "ticket",
        type: "radio",
        label: "Ticket type",
        required: true,
        options: ["Full conference", "Single day", "Workshop only", "Virtual"],
      },
      {
        id: "sessions",
        type: "checkbox",
        label: "Which sessions will you attend?",
        options: ["Opening keynote", "Morning workshops", "Panel discussion", "Evening reception"],
      },
      {
        id: "dietary",
        type: "checkbox",
        label: "Dietary needs",
        helpText: "Leave blank if none apply.",
        options: ["Vegetarian", "Vegan", "Gluten-free", "Halal", "Nut allergy"],
      },
      { id: "accessibility", type: "textarea", label: "Accessibility requirements" },
    ]),
  },
  {
    slug: "job-application",
    theme: "slate",
    name: "Job Application Form",
    category: "HR",
    description:
      "Collect candidate details, work history, and a CV in a single structured application instead of a pile of email attachments.",
    fields: build([
      { id: "sec-about", type: "heading", label: "About you" },
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "phone", type: "phone", label: "Phone number", required: true },
      { id: "address", type: "address", label: "Home address" },
      { id: "sec-role", type: "heading", label: "The role" },
      { id: "position", type: "text", label: "Position applying for", required: true },
      {
        id: "start-date",
        type: "date",
        label: "Earliest start date",
        required: true,
      },
      {
        id: "experience",
        type: "select",
        label: "Years of relevant experience",
        required: true,
        options: ["Less than 1", "1–3", "3–5", "5–10", "More than 10"],
      },
      { id: "linkedin", type: "file", label: "LinkedIn or portfolio link" },
      { id: "cv", type: "upload", label: "Upload your CV", required: true },
      {
        id: "cover",
        type: "textarea",
        label: "Why are you a good fit?",
        placeholder: "A short paragraph is plenty.",
      },
    ]),
  },
  {
    slug: "customer-feedback",
    theme: "sunset",
    name: "Customer Feedback Survey",
    category: "Survey",
    description:
      "Find out how customers rate your product or service, and what would make them recommend you to someone else.",
    fields: build([
      {
        id: "satisfaction",
        type: "radio",
        label: "How satisfied are you overall?",
        required: true,
        options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
      },
      {
        id: "recommend",
        type: "select",
        label: "How likely are you to recommend us?",
        required: true,
        options: [
          "10 — Extremely likely",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
          "1",
          "0 — Not at all likely",
        ],
      },
      {
        id: "liked",
        type: "checkbox",
        label: "What did we do well?",
        options: ["Product quality", "Value for money", "Customer support", "Speed", "Ease of use"],
      },
      { id: "improve", type: "textarea", label: "What could we do better?" },
      {
        id: "contact-ok",
        type: "radio",
        label: "May we follow up about your answers?",
        options: ["Yes", "No"],
      },
      { id: "email", type: "email", label: "Email address", helpText: "Only if you'd like a reply." },
    ]),
  },
  {
    slug: "rsvp",
    theme: "rose",
    name: "RSVP Form",
    category: "Events",
    description:
      "A short, friendly form for weddings, parties, and private events — headcount, meal choice, and a note for the hosts.",
    fields: build([
      { id: "name", type: "text", label: "Your name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      {
        id: "attending",
        type: "radio",
        label: "Will you be joining us?",
        required: true,
        options: ["Yes, wouldn't miss it", "Sadly, I can't make it"],
      },
      {
        id: "guests",
        type: "number",
        label: "How many guests are you bringing?",
        placeholder: "0",
      },
      {
        id: "meal",
        type: "select",
        label: "Meal preference",
        options: ["Chicken", "Fish", "Vegetarian", "Vegan"],
      },
      { id: "note", type: "textarea", label: "A note for the hosts" },
    ]),
  },
  {
    slug: "support-request",
    theme: "midnight",
    name: "Support Request Form",
    category: "Support",
    description:
      "Triage incoming issues with the context you actually need — severity, what happened, and a screenshot.",
    fields: build([
      { id: "name", type: "text", label: "Your name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      {
        id: "severity",
        type: "radio",
        label: "How urgent is this?",
        required: true,
        options: [
          "Critical — I can't work",
          "High — a key feature is broken",
          "Normal — something is wrong",
          "Low — a question or suggestion",
        ],
      },
      { id: "summary", type: "text", label: "Summary", required: true, placeholder: "One line" },
      {
        id: "detail",
        type: "textarea",
        label: "What happened?",
        required: true,
        helpText: "What you expected, what happened instead, and how to reproduce it.",
      },
      { id: "screenshot", type: "upload", label: "Screenshot or attachment" },
    ]),
  },
  {
    slug: "training-consultation",
    theme: "ink",
    name: "Personal Training Consultation",
    category: "Health & Fitness",
    description:
      "Sign up new personal training clients, set their exercise goals, and surface any injuries before the first session.",
    fields: build([
      { id: "sec-about", type: "heading", label: "About you" },
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "dob", type: "date", label: "Date of birth", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "phone", type: "phone", label: "Phone number", required: true },
      { id: "sec-goals", type: "heading", label: "Goals and history" },
      {
        id: "goals",
        type: "checkbox",
        label: "What are you hoping to achieve?",
        required: true,
        options: [
          "Lose weight",
          "Build strength",
          "Improve endurance",
          "Rehabilitation",
          "Sport-specific training",
          "General health",
        ],
      },
      {
        id: "activity",
        type: "radio",
        label: "How active are you right now?",
        required: true,
        options: [
          "Sedentary — little or no exercise",
          "Light — 1–2 sessions a week",
          "Moderate — 3–4 sessions a week",
          "Very active — 5+ sessions a week",
        ],
      },
      {
        id: "injuries",
        type: "textarea",
        label: "Any injuries, conditions, or medication we should know about?",
        required: true,
        helpText: "Write 'none' if this doesn't apply to you.",
      },
      {
        id: "availability",
        type: "checkbox",
        label: "When are you usually free?",
        options: ["Early morning", "Midday", "Evening", "Weekends"],
      },
    ]),
  },
  {
    slug: "liability-waiver",
    theme: "forest",
    name: "Liability Waiver & Consent",
    category: "Consent",
    description:
      "Get a signed acknowledgement of risk before an activity, class, or treatment — with a real drawn signature on file.",
    fields: build([
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "dob", type: "date", label: "Date of birth", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "address", type: "address", label: "Home address" },
      { id: "sec-terms", type: "heading", label: "Acknowledgement of risk" },
      {
        id: "agree",
        type: "checkbox",
        label: "Please confirm the following",
        required: true,
        helpText:
          "Replace this text with your own terms before publishing — this is placeholder wording, not legal advice.",
        options: [
          "I understand the risks involved and take part voluntarily",
          "I confirm I am medically fit to participate",
          "I release the organisers from liability for injury or loss",
        ],
      },
      {
        id: "emergency-contact",
        type: "text",
        label: "Emergency contact name and number",
        required: true,
      },
      { id: "signature", type: "signature", label: "Signature", required: true },
      { id: "signed-on", type: "date", label: "Date signed", required: true },
    ]),
  },
  {
    slug: "order-request",
    theme: "default",
    name: "Product Order Form",
    category: "Order",
    description:
      "Take orders without a storefront — product, quantity, delivery address, and any special instructions.",
    fields: build([
      { id: "name", type: "text", label: "Full name", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "phone", type: "phone", label: "Phone number", required: true },
      {
        id: "product",
        type: "select",
        label: "Product",
        required: true,
        options: ["Replace these options with your own products"],
      },
      { id: "quantity", type: "number", label: "Quantity", required: true, placeholder: "1" },
      { id: "delivery", type: "address", label: "Delivery address", required: true },
      {
        id: "shipping",
        type: "radio",
        label: "Shipping method",
        required: true,
        options: ["Standard (3–5 days)", "Express (1–2 days)", "Collect in store"],
      },
      { id: "notes", type: "textarea", label: "Special instructions" },
    ]),
  },
];

export function templateBySlug(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))].sort();
