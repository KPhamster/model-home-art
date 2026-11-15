import Link from "next/link";
import { Frame, Image, MessageCircle, Package, Palette, Shield, Truck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/config";
import { SectionHeading } from "@/components/ui/section-heading";

const lede = "Everything you need to frame, display, and preserve your most meaningful pieces.";

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
    // Less padding on top: the section above already fades into this one's background.
    <section className="bg-stone-900 pb-20 pt-10 text-stone-50 lg:pb-28 lg:pt-14">
      <div className="container-wide">
        <SectionHeading tone="dark" title="Our Services" lede={lede} />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-5">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Frame;
            return (
              <li
                key={service.id}
                className="reveal rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:p-6"
              >
                <span className="mb-5 flex size-11 items-center justify-center rounded-full border border-brand/50 text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-lg font-semibold leading-snug">{service.name}</h3>
                <p className="mt-2 text-sm text-stone-400">{service.description}</p>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-12 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/25 bg-transparent px-7 text-base text-stone-50 hover:bg-white/10 hover:text-white"
          >
            <Link href="/custom-framing">Learn More About Our Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
