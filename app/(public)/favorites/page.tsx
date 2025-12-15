
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getSavedProperties } from "@/actions/property";
import { PropertyCard } from "@/components/PropertyCard";
import { Property } from "@/types/property";

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/favorites");
  }

  // Use email as userId based on how toggleSaveProperty works in actions/property.ts
  const savedProperties = await getSavedProperties(session.user.email);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">My Saved Properties</h1>
        
        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border-light">
            <h2 className="text-xl font-bold text-text-primary mb-2">No saved properties yet</h2>
            <p className="text-text-secondary mb-6">Browse our listings and click the heart icon to save properties you like.</p>
            <a 
              href="/search" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-hover active:scale-95 transition-all"
            >
              Browse Properties
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
