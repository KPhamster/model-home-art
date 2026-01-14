import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { businessConfig } from "@/lib/config";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export function VisitUsSection() {
  return (
    <section id="visit-us" className="py-16 lg:py-20 bg-background">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Info */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">
                    Visit Our Shop
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{businessConfig.address.street}</p>
                        <p className="text-muted-foreground">
                          {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.zip}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        {businessConfig.hours.structured.map((item, i) => (
                          <p key={i} className={item.hours === "Closed" ? "text-muted-foreground" : ""}>
                            <span className="font-medium">{item.days}:</span> {item.hours}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a 
                        href={`tel:${businessConfig.phone}`} 
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {businessConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild>
                      <a href={businessConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get Directions
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Walk-ins welcome
                  </p>
                </div>

                {/* Map Placeholder */}
                <div className="aspect-square md:aspect-auto md:h-full min-h-[250px] rounded-lg bg-stone-200 border border-border overflow-hidden">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-4">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-stone-400" />
                      <p className="font-medium">[GOOGLE MAP EMBED]</p>
                      <p className="text-sm">Store location</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
