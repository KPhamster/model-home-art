import { Metadata } from "next";
import { businessConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Model Home Art - how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container-wide max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
          Privacy Policy
        </h1>

        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose-custom text-muted-foreground">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Contact Information:</strong> Name, email address, phone number, and 
                mailing address when you request a quote, make a purchase, or contact us.
              </li>
              <li>
                <strong>Order Information:</strong> Details about products you purchase, including 
                sizes, quantities, and customization preferences.
              </li>
              <li>
                <strong>Quote Request Information:</strong> Photos and descriptions of items you 
                want framed, along with your preferences and budget.
              </li>
              <li>
                <strong>Payment Information:</strong> Credit card and billing information processed 
                securely through our payment provider (Stripe).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <ul className="space-y-2">
              <li>Process and fulfill your orders and quote requests</li>
              <li>Communicate with you about your orders, quotes, and inquiries</li>
              <li>Send order confirmations, shipping notifications, and receipts</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Improve our products and services</li>
              <li>Send promotional communications (only with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Service Providers:</strong> Companies that help us operate our business, 
                such as payment processors, shipping carriers, and email service providers.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information. Payment information is processed securely through Stripe 
              and is not stored on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of promotional communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Cookies</h2>
            <p>
              We use cookies and similar technologies to improve your experience on our website, 
              remember your preferences, and analyze site traffic. You can control cookies through 
              your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for 
              the privacy practices of these sites. We encourage you to read their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, contact us at:
            </p>
            <p className="mt-4">
              <strong>{businessConfig.name}</strong><br />
              {businessConfig.address.full}<br />
              Email:{" "}
              <a href={`mailto:${businessConfig.email}`} className="text-primary hover:underline">
                {businessConfig.email}
              </a><br />
              Phone:{" "}
              <a href={`tel:${businessConfig.phone}`} className="text-primary hover:underline">
                {businessConfig.phone}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
