
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getSavedProperties } from "@/actions/property";
import { PropertyCard } from "@/components/PropertyCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FavoritesPage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    redirect("/");
  }

  // We are using email as user_id for now as per our action implementation
  const savedProperties = await getSavedProperties(session.user.email);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold text-text-primary">My Favorites</h1>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border-light">
            <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">No favorites yet</h2>
            <p className="text-text-secondary mb-8">
              Start exploring and save properties you love!
            </p>
            <Button asChild size="lg">
              <Link href="/search">Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
