import React from "react";

interface Props {
  txHash?: string;
  label?: string;
  network?: "testnet" | "public";
}

const StellarExpertLink: React.FC<Props> = ({
  txHash,
  label = "View on Stellar Expert",
  network = "testnet",
}) => {
  if (!txHash || txHash.length < 64) return null;
  const baseUrl = network === "public"
    ? "https://stellar.expert/explorer/public/tx/"
    : "https://stellar.expert/explorer/testnet/tx/";

  return (
    <a
      href={baseUrl + txHash}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "6px",
        background: "rgba(102,126,234,0.1)",
        color: "#667eea",
        fontSize: "13px",
        textDecoration: "none",
        transition: "background 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102,126,234,0.2)")}
      onMouseOut={(e) => (e.currentTarget.style.background = "rgba(102,126,234,0.1)")}
    >
      🔗 {label}
    </a>
  );
};

export default StellarExpertLink;
