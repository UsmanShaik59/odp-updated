import HalftoneWordmarkFooter from "./ui/halftone-wordmark-footer";

export default function SiteFooter() {
  return (
    <HalftoneWordmarkFooter
      wordmark="odp"
      label="OneStep Dream Property"
      meta="ODP Services · © 2026"
      preset="sky"
      palette={{ background: "#f5faff", ink: "#152b43", warm: "#5b9bd5" }}
      dotGap={6}
      radius={88}
      crop={0.16}
      grain={0.28}
      columns={[
        {
          title: "Explore",
          links: [
            { label: "Buy Flats", href: "#properties" },
            { label: "Properties", href: "#properties" },
            { label: "Locations", href: "#locations" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "List Property", href: "#contact" },
          ],
        },
        {
          title: "Get in touch",
          links: [
            {
              label: "help.onestepdreamproperty@gmail.com",
              href: "mailto:help.onestepdreamproperty@gmail.com",
            },
            { label: "+91 7411535782", href: "tel:+917411535782" },
          ],
        },
      ]}
    />
  );
}
