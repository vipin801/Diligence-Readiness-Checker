import Image from "next/image";

/** The supplied brand artwork, framed around the wordmark for compact credits. */
export function IncentivLogo() {
  return (
    <Image
      src="/incentiv-logo.jpg"
      alt="Incentiv"
      width={200}
      height={200}
      unoptimized
      className="incentiv-logo"
    />
  );
}
