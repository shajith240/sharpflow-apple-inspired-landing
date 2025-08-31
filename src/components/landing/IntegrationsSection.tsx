import VerticalLogoLoop from "../../blocks/Animations/LogoLoop/VerticalLogoLoop";

const IntegrationsSection = () => {
  const integrationFiles = [
    "airtable.webp",
    "asana.webp",
    "aws.png",
    "azure.webp",
    "bar_chart_logo.svg",
    "clickup.webp",
    "duckdb.webp",
    "facebook.webp",
    "gcp.webp",
    "ghl.webp",
    "googledrive.webp",
    "hubspot.webp",
    "make.webp",
    "microsoftsql.webp",
    "monday.avif",
    "mongodb.svg",
    "mysql.webp",
    "notion.webp",
    "pipedrive.webp",
    "postgres.webp",
    "slack.webp",
    "sqlite.webp",
    "supabase.webp",
  ];

  const toTitle = (file: string) =>
    file
      .replace(/\.(svg|png|jpg|jpeg|webp|avif)$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  const allLogos = integrationFiles.map((name) => ({
    src: `/integrations/${name}`,
    alt: toTitle(name),
    height: 36,
  }));

  const logosRowA = allLogos.filter((_, i) => i % 2 === 0);
  const logosRowB = allLogos.filter((_, i) => i % 2 === 1);

  return (
    <section className="section-padding">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Integrate With Tools You Know and Love
            </h2>
            <p className="text-muted-foreground mb-6">
              TrueHorizon offers integration with 850+ industry standard tools.
            </p>
            <a
              href="#tech-stack"
              className="text-primary underline underline-offset-4"
            >
              View our tech stack here.
            </a>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-16 lg:gap-24 sm:pl-4 md:pl-8 lg:pl-16 justify-center">
            <VerticalLogoLoop
              logos={logosRowA}
              speed={28}
              direction="up"
              logoHeight={36}
              gap={48}
              pauseOnHover={false}
              fadeOut={true}
              className="h-[380px] md:h-[520px] mx-auto"
            />
            <VerticalLogoLoop
              logos={logosRowB}
              speed={32}
              direction="down"
              logoHeight={36}
              gap={48}
              pauseOnHover={false}
              fadeOut={true}
              className="h-[380px] md:h-[520px] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
