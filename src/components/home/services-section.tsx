import Link from "next/link";
import { services } from "@/lib/config";
import {
  Frame, Package, Image, Shield, Wrench, MessageCircle, Truck, Palette,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  frame: Frame,
  package: Package,
  image: Image,
  shield: Shield,
  wrench: Wrench,
  "message-circle": MessageCircle,
  truck: Truck,
  palette: Palette,
};

export function ServicesSection() {
  return (
    <section className="py-16 lg:py-20 bg-stone-900 text-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            Our Services
          </h2>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Everything you need to frame, display, and preserve your most meaningful pieces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Frame;
            return (
              <div
                key={service.id}
                className="group p-6 rounded-xl bg-stone-800/50 hover:bg-stone-800 border border-stone-700 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-stone-400">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/custom-framing"
            className="inline-block px-6 py-3 bg-white text-stone-900 font-medium rounded-lg hover:bg-stone-100 transition-colors"
          >
            Learn More About Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
