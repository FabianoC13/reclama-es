export function Tier2Disclaimer({ variant = 'overview' }: { variant?: 'overview' | 'receipt' | 'mediation' }) {
  const copy = {
    overview:
      'Esta herramienta te ayuda a preparar y organizar tu presentación. Debes completar el trámite tú mismo en la web oficial. Nunca pedimos tu Cl@ve, contraseña de certificado, PIN del DNIe ni claves privadas.',
    receipt:
      'Guardar el justificante oficial ayuda a acreditar que presentaste la reclamación. No garantiza que la empresa acepte tu reclamación ni que la autoridad ordene un reembolso.',
    mediation:
      'Las oficinas de consumo suelen mediar entre consumidor y empresa. La mediación puede presionar a la empresa y crear constancia oficial, pero puede no obligar al pago. Si falla, podrían ser necesarios arbitraje, denuncia o vía judicial.',
  };

  return (
    <div className="disclaimer-box text-sm">
      <p>{copy[variant]}</p>
    </div>
  );
}
