import { notFound } from "next/navigation";
import { AppointmentBooking } from "@/components/appointment-booking";
import { properties } from "@/lib/properties";

export function generateStaticParams() {
  return properties.map((_, id) => ({
    id: String(id),
  }));
}

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentPage({
  params,
}: AppointmentPageProps) {
  const { id } = await params;

  // Accept only non-negative integer property indexes.
  if (!/^(0|[1-9]\d*)$/.test(id)) {
    notFound();
  }

  const propertyIndex = Number(id);

  // Make sure the index is within the available properties.
  if (
    !Number.isSafeInteger(propertyIndex) ||
    propertyIndex >= properties.length
  ) {
    notFound();
  }

  const property = properties[propertyIndex];

  if (!property) {
    notFound();
  }

  return <AppointmentBooking property={property} />;
}
