import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// Placeholder reviews
const reviews = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely fantastic work! They framed my daughter's diploma beautifully and the price was very reasonable. Will definitely be back.",
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "Michael T.",
    rating: 5,
    text: "Had several jerseys framed here. The quality is top-notch and they really took the time to help me pick the perfect frames. Highly recommend!",
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Jennifer L.",
    rating: 5,
    text: "Great experience from start to finish. The staff was knowledgeable and helped me stay within my budget. My art looks amazing!",
    date: "1 month ago",
  },
  {
    id: "4",
    name: "David K.",
    rating: 5,
    text: "They installed 12 frames in our office and it looks incredible. Professional, on-time, and fairly priced. Will use again for sure.",
    date: "2 months ago",
  },
  {
    id: "5",
    name: "Emily R.",
    rating: 5,
    text: "Love this place! They were able to repair an antique frame that I thought was beyond saving. So grateful!",
    date: "2 months ago",
  },
  {
    id: "6",
    name: "Robert H.",
    rating: 5,
    text: "Quick turnaround and excellent communication. The online quote process was easy and the final product exceeded expectations.",
    date: "3 months ago",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground">
            5.0 average rating • 150+ reviews on Google
          </p>
        </div>

        {/* Google Reviews Embed Placeholder */}
        <div className="mb-8 p-4 bg-stone-100 rounded-lg border border-border text-center text-muted-foreground">
          <p className="font-medium">[EMBEDDED GOOGLE REVIEWS WIDGET]</p>
          <p className="text-sm">Integrate with Google Business Profile API</p>
        </div>

        {/* Review Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 line-clamp-4">"{review.text}"</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-muted-foreground">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-8">
          <a
            href="https://g.page/modelhomeart/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            See all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
