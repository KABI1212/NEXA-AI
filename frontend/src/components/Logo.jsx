import logo from "../../assets/nexa-logo.png";

export default function Logo({ className = "h-10" }) {
  return <img src={logo} alt="Nexa AI" className={className} />;
}
