// @ts-nocheck
import logoSvg from "../../assets/logo.svg";
import logoLightSvg from "../../assets/logo-light.svg";
import logoDarkSvg from "../../assets/logo-dark.svg";

export default function Logo({ className = "h-10", variant = "default" }) {
  const src = variant === "light" ? logoLightSvg : variant === "dark" ? logoDarkSvg : logoSvg;
  return <img src={src} alt="Nexa AI" className={className} />;
}