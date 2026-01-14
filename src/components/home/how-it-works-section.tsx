import { Camera, Palette, Truck } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Camera,
    title: "Send a photo + size",
    description: "Upload photos of your item and share the dimensions. Not sure? We can help you measure.",
  },
  {
    number: "2",
    icon: Palette,
    title: "We design options",
    description: "We'll create framing options that fit your style and budget. No pressure, no surprises.",
  },
  {
    number: "3",
    icon: Truck,
    title: "Pickup, delivery, or ship",
    description: "Pick up from our shop, schedule local delivery with installation, or we'll ship it to you.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting your piece framed is easy — here's how.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
