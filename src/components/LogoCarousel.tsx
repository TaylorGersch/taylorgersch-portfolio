import Image from "next/image";

const LOGOS = [
  { file: "Airbnb.svg", alt: "Airbnb" },
  { file: "Stripe.svg", alt: "Stripe" },
  { file: "TruStage.svg", alt: "TruStage" },
  { file: "Flo.svg", alt: "Flo" },
  { file: "HingeHealth.svg", alt: "Hinge Health" },
  { file: "Allstate.svg", alt: "Allstate" },
  { file: "JohnsonOutdoors.svg", alt: "Johnson Outdoors" },
  { file: "Behr.svg", alt: "BEHR" },
  { file: "Rutter.svg", alt: "Rutter" },
  { file: "Kelloggs.svg", alt: "Kellogg's" },
  { file: "FLYRLabs.svg", alt: "FLYR Labs" },
  { file: "Mutiny.svg", alt: "Mutiny" },
  { file: "Myst.svg", alt: "Myst" },
  { file: "RISD.svg", alt: "RISD" },
];

export default function LogoCarousel() {
  // Render the list twice so the marquee can loop seamlessly at -50%.
  const items = [...LOGOS, ...LOGOS];

  return (
    <div className="logo-carousel" aria-label="Clients we've worked with">
      <ul className="logo-track">
        {items.map((logo, i) => (
          <li className="logo-track__cell" key={`${logo.file}-${i}`}>
            <Image
              className="logo-track__item"
              src={`/logos/${logo.file}`}
              alt={`${logo.alt} logo`}
              height={28}
              width={120}
              style={{ width: "auto", height: 28 }}
              unoptimized
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
