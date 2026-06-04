"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisclaimerModal from "./DisclaimerModal";

export default function DownloadButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button className="w-full" onClick={() => setModalOpen(true)}>
        <Download className="mr-2 h-4 w-4" />
        Descargar borrador (PDF)
      </Button>
      <DisclaimerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={handlePrint}
      />
    </>
  );
}
