import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troubleshooting | CarPlay & Android Auto Support",
  description:
    "Fix wireless Apple CarPlay and Android Auto disconnections on M Coding MMI boxes and Android screens. Step-by-step Bluetooth troubleshooting guide.",
  keywords:
    "CarPlay disconnecting, Android Auto disconnecting, wireless CarPlay troubleshooting, BMW MMI box, Android screen, Bluetooth interference, MMI box support",
  openGraph: {
    title: "Troubleshooting | CarPlay & Android Auto",
    description:
      "Fix wireless Apple CarPlay and Android Auto disconnections on M Coding MMI boxes and Android screens.",
    url: "https://m-coding.ie/troubleshooting",
    type: "website",
  },
};

export default function TroubleshootingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
