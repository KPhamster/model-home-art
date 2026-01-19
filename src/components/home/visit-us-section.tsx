import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { businessConfig } from "@/lib/config";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import visitShopImage from "../../../assets/visit_our_shop_image.jpg";

export function VisitUsSection() {
  return (
    <section id="visit-us" className="py-16 lg:py-20 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-0 items-stretch">
          {/* Image Side */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-auto lg:min-h-[600px] rounded-2xl lg:rounded-r-none overflow-hidden">
            <img
              src={visitShopImage.src}
              alt="Inside the Model Home Art shop with framed art displays"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
          </div>

          {/* Content Side */}
          <div className="lg:bg-muted/30 lg:rounded-r-2xl lg:border lg:border-l-0 lg:border-border">
            <div className="h-full flex flex-col justify-center p-6 md:p-8 lg:p-10 xl:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold mb-6 lg:mb-8">
                Visit Our Shop
              </h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{businessConfig.address.street}</p>
                    <p className="text-muted-foreground">
                      {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.zip}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    {businessConfig.hours.structured.map((item, i) => (
                      <p key={i} className={item.hours === "Closed" ? "text-muted-foreground" : ""}>
                        <span className="font-medium">{item.days}:</span> {item.hours}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <a 
                    href={`tel:${businessConfig.phone}`} 
                    className="font-medium text-lg hover:text-primary transition-colors"
                  >
                    {businessConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button size="lg" asChild>
                  <a href={businessConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Walk-ins welcome
              </p>

              {/* Map Embed */}
              <div className="mt-8 aspect-video rounded-xl border border-border overflow-hidden shadow-sm">
                <iframe
                  src={businessConfig.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Model Home Art Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
