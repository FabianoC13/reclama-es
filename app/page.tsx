"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  FileText,
  Send,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, stagger, easeTrans, viewport } from "@/lib/motion";

const CLAIM_TYPES = [
  "Telecomunicaciones",
  "Energía y suministros",
  "Comercio electrónico",
  "Banca y seguros",
  "Transporte",
  "Servicios en general",
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-24 text-center sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232A2420' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.1)}
          className="relative z-10 max-w-3xl"
        >
          <motion.h1
            variants={fadeUp}
            transition={easeTrans}
            className="font-display text-5xl font-bold leading-tight text-text-primary sm:text-6xl"
          >
            Reclama lo que es tuyo.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={easeTrans}
            className="mt-6 text-lg leading-relaxed text-text-secondary"
          >
            Rellena tu hoja de reclamación de la OMIC en minutos. Sin abogados ni
            tecnicismos. Solo tú, tu reclamación, y un formulario bien hecho.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={easeTrans}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/reclamacion">Empezar mi reclamación</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#como-funciona">Cómo funciona</a>
            </Button>
          </motion.div>
          <motion.p
            variants={fadeUp}
            transition={easeTrans}
            className="mt-6 text-sm text-text-tertiary"
          >
            Reclama es una herramienta de asistencia administrativa. No proporciona
            asesoramiento jurídico. Para consejo legal, consulta a un abogado.
          </motion.p>
        </motion.div>
        <ChevronDown className="absolute bottom-8 h-6 w-6 animate-bounce-subtle text-text-tertiary" />
      </section>

      {/* Cómo funciona */}
      <section
        id="como-funciona"
        className="bg-bg-surface py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            transition={easeTrans}
            className="text-center font-display text-3xl font-semibold"
          >
            Tres pasos. Sin complicaciones.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger(0.1)}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {[
              {
                icon: ClipboardList,
                title: "Cuéntanos qué pasó",
                body: "Responde un formulario guiado con preguntas simples. Sin jerga jurídica.",
              },
              {
                icon: FileText,
                title: "Generamos el borrador",
                body: "Nuestra herramienta redacta tu hoja de reclamación usando lo que nos has contado. Tú la revisas y editas.",
              },
              {
                icon: Send,
                title: "Tú la envías",
                body: "Te guiamos paso a paso para presentarla en la OMIC de tu municipio o por vía electrónica.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={easeTrans}
                className="card-surface p-6"
              >
                <Icon className="mb-4 h-8 w-8 text-accent-green" />
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Para qué sirve */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            transition={easeTrans}
            className="font-display text-3xl font-semibold"
          >
            Qué tipo de reclamaciones puedes preparar
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger(0.05)}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {CLAIM_TYPES.map((type) => (
              <motion.div key={type} variants={fadeUp} transition={easeTrans}>
                <Badge variant="default" className="px-4 py-2 text-sm">
                  {type}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          <p className="mt-6 text-sm text-text-secondary">
            Para disputas de mayor complejidad o cuantía, consulta a un abogado
            colegiado.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-text-primary py-16 text-bg-surface lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">
            ¿Listo para reclamar?
          </h2>
          <Button asChild size="lg" variant="secondary" className="mt-8 border-bg-surface text-bg-surface hover:bg-bg-surface hover:text-text-primary">
            <Link href="/reclamacion">Empezar ahora</Link>
          </Button>
          <p className="mt-4 text-sm opacity-80">
            Gratuito. Sin registro. Sin almacenamiento de tus datos.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-bg-surface p-6 shadow-soft">
            <div className="border-l-4 border-accent-green pl-4">
              <h3 className="font-display text-lg font-semibold">Aviso importante</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Reclama es una herramienta de apoyo administrativo, no un servicio
                de asesoramiento jurídico. La información y los documentos generados
                tienen carácter informativo y no constituyen consejo legal. Reclama
                no representa a los usuarios ni actúa en su nombre. Para recibir
                asesoramiento jurídico personalizado, consulte a un abogado
                colegiado. La decisión de presentar cualquier reclamación
                corresponde exclusivamente al usuario.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
