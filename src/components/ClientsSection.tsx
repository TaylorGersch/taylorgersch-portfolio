const CLIENT_COLUMNS = [
  ["BetterUp", "Airbnb", "Stripe", "TruStage", "Flo"],
  ["Hinge Health", "Allstate", "Johnson Outdoors", "Behr Paint"],
  ["Rutter", "Kelloggs", "EcoTools", "FLYR Labs"],
];

export default function ClientsSection() {
  return (
    <section className="bg-neutral-100 px-6 py-20 sm:px-10 sm:py-28">
      <h3 className="mb-16 text-4xl font-normal tracking-tight text-neutral-900 sm:mb-20 sm:text-6xl">
        Clients
      </h3>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
        {CLIENT_COLUMNS.map((column, i) => (
          <ul key={i} className="space-y-1 text-2xl text-neutral-900">
            {column.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
