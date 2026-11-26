import Reveal from "./Reveal";

export default function SectionHeading({
  badge,
  title,
  highlight,
  after,
  text,
  align = "center",
  icon,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  after?: string;
  text?: React.ReactNode;
  align?: "center" | "left";
  icon?: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} mb-10 max-w-2xl`}>
      {badge && (
        <div className={`badge mb-5 w-fit ${center ? "mx-auto" : ""}`}>
          {icon}
          {badge}
        </div>
      )}
      <h2 className="heading mb-3 text-[clamp(26px,3vw,38px)] font-black">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
        {after}
      </h2>
      {text && <p className={`text-[14px] leading-relaxed text-white/40 ${center ? "mx-auto max-w-lg" : "max-w-xl"}`}>{text}</p>}
    </Reveal>
  );
}
