"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";
import { images } from "@/constants/images";

type Phase = "closed" | "open" | "details";
type Overlay = "details" | "story" | null;
type HostTab = "both" | "groom" | "bride";
type CeremonySlot = "baci" | "reception";

const invitation = {
  eyebrow: "A Love Letter From",
  names: "Souksawat & Sengsouliphone",
  shortNames: "S & S",
  date: "20 · 11 · 2026",
  dateISO: "2026-11-20T00:00:00",
  time: "Sample time",
  venue: "Sample venue · to be confirmed",
  quote:
    "A lifetime of memories brought us here, and our favourite chapter is about to begin",
  schedule: [
    { time: "09:00", title: "Morning ceremony", note: "Sample agenda item" },
    { time: "11:30", title: "Lunch reception", note: "Sample agenda item" },
    { time: "18:00", title: "Evening celebration", note: "Sample agenda item" },
  ],
  dressCode: "Sample dress code — sage green, ivory, or soft neutrals",
  loveStory:
    "Sample love story — how we met, the adventures we shared, and the moment we knew. Replace this text with your real story.",
  contact: "Sample contact — souksawatandsengsouliphone@example.com",
  laoCard: {
    title: "ບັດເຊີນ",
    groomHostsTitle: "ເຈົ້າພາບຝ່າຍຊາຍ",
    groomHosts: [
      { left: "ທ່ານ ນ. ສຸກສົມຫວັງ ສຸລິວັນ ພ້ອມດ້ວຍຄອບຄົວ", right: "" },
      { left: "ທ່ານ ນອນ ແສງມະນີ", right: "ແລະ ທ່ານ ນ. ຄຳປະເສີດ ແສງມະນີ" },
      { left: "ທ່ານ ທອງວັນ ພົມດີ", right: "ແລະ ທ່ານ ນ. ພອນທິບ ນິໄຊກອນ" },
      { left: "ທ່ານ ອິນປັນ ສັດຈະພັນສີ", right: "ແລະ ທ່ານ ນ. ຈັນມະນີ ສັດຈະພັນສີ" },
      { left: "ທ່ານ ພົມພອນ ສີຫາລາດ", right: "ແລະ ທ່ານ ນ. ວາດສະໜາ ຄອນຕັນ" },
    ],
    brideHostsTitle: "ເຈົ້າພາບຝ່າຍຍິງ",
    brideHosts: [
      { left: "ທ່ານ ແສງແກ້ວ ພິລາວົງ", right: "ແລະ ທ່ານ ນ. ສຸຈິນດາ ມະນີປຸນ" },
      { left: "ທ່ານ ວຽງທະວີສອນ ເທບພະຈັນ", right: "ແລະ ທ່ານ ນ. ຈາລຸວັນ ເທບພະຈັນ" },
      { left: "ທ່ານ ທະວີໄຊ ເຜົ່າຊົມພູ", right: "ແລະ ທ່ານ ນ. ລີວົງ ລາວລີ" },
      { left: "ທ່ານ ແກ້ວປະສົງ ໄຊໂກສີ", right: "ແລະ ທ່ານ ນ. ດາລາສຸກ ແກ້ວໜູຈັນ" },
      { left: "ທ່ານ ສົມພອນ ຮຸ່ງຍະຈິດ", right: "ແລະ ທ່ານ ນ. ມະນີສຸກ ພິລາວົງ" },
    ],
    inviteLine1: "ພ້ອມດ້ວຍຄອບຄົວ ແລະ ຍາດພີ່ນ້ອງທັງສອງຝ່າຍ",
    inviteLine2:
      "ມີຄວາມຍິນດີຂໍຖືເປັນກຽດຮຽນເຊີນທ່ານ ເຂົ້າຮ່ວມໃນງານສ້າງຄອບຄົວໃໝ່ ລະຫວ່າງ",
    coupleLao: "ສຸກສະຫວັດ ສຸລິວັນ (ແຈັກ)  ແລະ  ແສງສຸລິພອນ ພິລາວົງ (ເອັມມີ້)",
    groomNameLao: "ສຸກສະຫວັດ ສຸລິວັນ (ແຈັກ)",
    brideNameLao: "ແສງສຸລິພອນ ພິລາວົງ (ເອັມມີ້)",
    coupleEng: "SOUKSAWAT SOULIVANH  AND  SENGSOULIPHONE PHILAVONG",
    dateLao: "ວັນສຸກ, 20 ພະຈິກ 2026",
    ceremonyLeft: {
      time: "15:00",
      label: "ພິທີສູ່ຂວັນ",
      detail: "ພິທີສູ່ຂວັນຕາມຮີດຄອງປະເພນີລາວ ແລະ ຜູກແຂນອວຍພອນຄູ່ບ່າວສາວ",
    },
    ceremonyRight: {
      time: "19:00",
      label: "ພິທີງານລ້ຽງ",
      detail: "ຮ່ວມຮັບປະທານອາຫານຄ່ຳ ແລະ ສະຫຼອງມົງຄົນສົມຣົດ ທີ່ຫ້ອງຈັດລ້ຽງ",
    },
    venueLao: "ສະຖານທີ່ : ໂຮງແຮມ ແລນມາກ ແມ່ຂອງຮີເວີໄຊທ໌",
    venueTitleLao: "ໂຮງແຮມ ແລນມາກ ແມ່ຂອງຮີເວີໄຊທ໌",
    venueTitleEng: "The Landmark Mekong Riverside Hotel",
    venueAddressLao: "ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ",
    venueMapUrl:
      "https://www.google.com/maps/search/?api=1&query=The+Landmark+Mekong+Riverside+Hotel+Vientiane",
    venueEmbedUrl:
      "https://www.google.com/maps?q=The+Landmark+Mekong+Riverside+Hotel+Vientiane&output=embed",
    calendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Souksawat+%26+Sengsouliphone+Wedding&dates=20261120T080000Z/20261120T150000Z&details=%E0%BA%9E%E0%BA%B4%E0%BA%97%E0%BA%B5%E0%BA%AA%E0%BA%B9%E0%BB%88%E0%BA%82%E0%BA%A7%E0%BA%B1%E0%BA%99+15%3A00+%7C+%E0%BA%9E%E0%BA%B4%E0%BA%97%E0%BA%B5%E0%BA%87%E0%BA%B2%E0%BA%99%E0%BA%A5%E0%BB%89%E0%BA%BD%E0%BA%87+19%3A00&location=The+Landmark+Mekong+Riverside+Hotel+Vientiane",
  },
};

const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function useCountdown(targetISO: string, active: boolean) {
  const target = new Date(targetISO).getTime();
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [active, target]);

  const diff = now === 0 ? 0 : Math.max(0, target - now);
  return {
    now,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Page() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [hostTab, setHostTab] = useState<HostTab>("both");
  const [activeCeremony, setActiveCeremony] = useState<CeremonySlot>("baci");
  const [copiedVenue, setCopiedVenue] = useState(false);
  const reduceMotion = useReducedMotion();

  const copyVenue = async () => {
    try {
      await navigator.clipboard.writeText(
        `${invitation.laoCard.venueTitleLao} (${invitation.laoCard.venueTitleEng})`,
      );
      setCopiedVenue(true);
      setTimeout(() => setCopiedVenue(false), 2200);
    } catch {
      setCopiedVenue(false);
    }
  };
  const countdown = useCountdown(invitation.dateISO, phase === "details");

  useEffect(() => {
    if (phase !== "open") return;
    const timer = setTimeout(
      () => setPhase("details"),
      reduceMotion ? 0 : 1700,
    );
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const openEnvelope = () => {
    if (phase !== "closed") return;
    setOverlay(null);
    setPhase(reduceMotion ? "details" : "open");
  };

  return (
    <main className="invitation">
      <AnimatePresence mode="wait">
        {phase === "closed" && (
          <motion.section
            key="closed"
            className="envelope-scene"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            <p className="scene-eyebrow">{invitation.eyebrow}</p>
            <h1 className="scene-names">{invitation.names}</h1>
            <button
              type="button"
              className="closed-envelope"
              onClick={openEnvelope}
              aria-label="เปิดซองการ์ดเชิญ"
            >
              <Image
                src={images.envelope1}
                alt=""
                width={1160}
                height={810}
                priority
                sizes="(max-width: 640px) 85vw, 520px"
              />
            </button>
            <p className="scene-hint">Open the invitation</p>
          </motion.section>
        )}

        {phase === "open" && (
          <motion.section
            key="open"
            className="envelope-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            aria-label="กำลังเปิดซอง"
          >
            <div className="open-stage">
              <div className="envelope-back">
                <Image
                  src={images.envelope2}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 640px) 88vw, 480px"
                />
                <motion.div
                  className="envelope-back-couple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  aria-hidden="true"
                >
                  <Image
                    src={images.envelope2Couple}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 640px) 88vw, 480px"
                  />
                </motion.div>
              </div>

              <div className="envelope-front" aria-hidden="true">
                <Image
                  src={images.envelope2Front}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 640px) 88vw, 480px"
                />
              </div>

              <motion.div
                className="letter-card"
                initial={{ y: "70%", zIndex: 2 }}
                animate={{ y: "0%", zIndex: 4 }}
                transition={{
                  duration: 1.2,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                  zIndex: { delay: 1.55, duration: 0 },
                }}
              >
                <div className="heart-card">
                  <Image
                    src={images.heart}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 640px) 70vw, 360px"
                  />
                  <div className="heart-card-text">
                    <p className="letter-eyebrow">We&apos;re getting</p>
                    <p className="letter-script">Married</p>
                    <p className="letter-date">{invitation.date}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {phase === "details" && (
          <motion.div
            key="details"
            className="snap-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            {/* Section 1 — opened envelope with card, like the video reveal */}
            <section className="snap-section section-reveal-stage">
              <div className="open-stage">
                <div className="envelope-back">
                  <Image
                    src={images.envelope2}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 88vw, 480px"
                  />
                  <div className="envelope-back-couple" aria-hidden="true">
                    <Image
                      src={images.envelope2Couple}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 88vw, 480px"
                    />
                  </div>
                </div>
                <div className="envelope-front" aria-hidden="true">
                  <Image
                    src={images.envelope2Front}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 88vw, 480px"
                  />
                </div>
                <div className="letter-card letter-card-front">
                  <div className="heart-card">
                    <Image
                      src={images.heart}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 70vw, 360px"
                    />
                    <div className="heart-card-text">
                      <p className="letter-eyebrow">We&apos;re getting</p>
                      <p className="letter-script">Married</p>
                      <p className="letter-date">{invitation.date}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="scroll-hint" aria-hidden="true">
                Scroll
              </p>
            </section>

            {/* Section 2 — quote, names, photos, countdown */}
            <section className="snap-section section-countdown">
              <motion.div className="section-inner" {...sectionReveal}>
                <p className="quote">{invitation.quote}</p>
                <h2 className="section-names">{invitation.names}</h2>
                <div className="locket">
                  <figure className="locket-photo locket-photo-left">
                    <Image
                      src={images.locketLeft}
                      alt="ภาพคู่บ่าวสาว"
                      fill
                      sizes="(max-width: 640px) 28vw, 140px"
                    />
                  </figure>
                  <figure className="locket-photo locket-photo-right">
                    <Image
                      src={images.locketRight}
                      alt="ภาพคู่บ่าวสาว"
                      fill
                      sizes="(max-width: 640px) 28vw, 140px"
                    />
                  </figure>
                  <Image
                    src={images.heartLag}
                    alt=""
                    width={1368}
                    height={758}
                    sizes="(max-width: 640px) 92vw, 560px"
                    className="locket-frame"
                  />
                </div>
                <div
                  className="countdown"
                  role="timer"
                  aria-label="นับถอยหลังสู่วันงาน"
                >
                  <span>
                    <strong>
                      {countdown.now ? pad(countdown.days) : "--"}
                    </strong>
                    <small>Days</small>
                  </span>
                  <i aria-hidden="true">:</i>
                  <span>
                    <strong>
                      {countdown.now ? pad(countdown.hours) : "--"}
                    </strong>
                    <small>Hours</small>
                  </span>
                  <i aria-hidden="true">:</i>
                  <span>
                    <strong>
                      {countdown.now ? pad(countdown.minutes) : "--"}
                    </strong>
                    <small>Minutes</small>
                  </span>
                  <i aria-hidden="true">:</i>
                  <span>
                    <strong>
                      {countdown.now ? pad(countdown.seconds) : "--"}
                    </strong>
                    <small>Seconds</small>
                  </span>
                </div>
              </motion.div>
            </section>

            {/* Section 3 — RSVP */}
            {/* <section className="snap-section section-rsvp">
              <motion.div className="section-inner" {...sectionReveal}>
                <p className="rsvp-script">Rsvp</p>
                <div className="rsvp-card">
                  <Image
                    src="/images/envelope-1.png"
                    alt=""
                    width={1160}
                    height={810}
                    sizes="(max-width: 640px) 80vw, 440px"
                    className="rsvp-envelope"
                  />
                  <Image
                    src="/images/goose.png"
                    alt="Kindly Respond Here"
                    width={1308}
                    height={1074}
                    sizes="(max-width: 640px) 62vw, 320px"
                    className="rsvp-goose"
                  />
                </div>
              </motion.div>
            </section> */}

            {/* Section 3 — Lao Formal Invitation */}
            <section className="snap-section section-lao-card">
              <style>{`
                .section-lao-card {
                  font-family: var(--font-lao), "Noto Sans Lao Looped", "Phetsarath OT", sans-serif;
                  color: #4f573d;
                  padding: 1.5rem 0.85rem;
                  overflow: hidden;
                  background:
                    radial-gradient(circle at 12% 18%, rgba(168, 181, 155, 0.28), transparent 45%),
                    radial-gradient(circle at 88% 82%, rgba(168, 181, 155, 0.25), transparent 45%);
                }
                .lao-botanical {
                  position: absolute;
                  pointer-events: none;
                  width: clamp(58px, 11vw, 115px);
                  height: auto;
                  opacity: 0.45;
                  z-index: 0;
                  animation: botanical-sway 7s ease-in-out infinite;
                }
                .lao-botanical-left { left: -8px; top: 4%; }
                .lao-botanical-right { right: -8px; bottom: 4%; transform: scaleX(-1); animation-delay: -3.5s; }
                @keyframes botanical-sway {
                  0%, 100% { transform: translateY(0) rotate(0deg); }
                  50% { transform: translateY(-6px) rotate(1.5deg); }
                }
                .lao-card-shell {
                  position: relative;
                  z-index: 1;
                  width: 100%;
                  max-width: 900px;
                  background: rgba(250, 247, 239, 0.88);
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(127, 140, 114, 0.35);
                  border-radius: 20px;
                  padding: 6px;
                  box-shadow: 0 24px 60px rgba(72, 82, 58, 0.14), 0 2px 8px rgba(72, 82, 58, 0.06);
                }
                .lao-card-inner {
                  width: 100%;
                  border: 1px solid rgba(127, 140, 114, 0.24);
                  border-radius: 15px;
                  padding: clamp(1.1rem, 2.6vw, 2rem) clamp(0.85rem, 2.5vw, 2rem);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 0.85rem;
                }
                .lao-header { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
                .lao-crest {
                  width: 42px; height: 42px; border-radius: 50%;
                  border: 1px solid rgba(127, 140, 114, 0.55);
                  background: radial-gradient(circle, #faf7ef 0%, #ece6d6 100%);
                  display: grid; place-items: center;
                  font-family: "Sloop Script Three", Georgia, serif;
                  font-size: 1.1rem; color: #6b7659;
                  box-shadow: 0 4px 12px rgba(80, 90, 66, 0.14);
                }
                .lao-eyebrow {
                  margin: 0.1rem 0 0;
                  font-family: Georgia, "Times New Roman", serif;
                  font-size: 0.6rem; letter-spacing: 0.32em; color: #8a917c;
                }
                .lao-title {
                  margin: 0; font-size: clamp(1.3rem, 3.8vw, 1.8rem);
                  font-weight: 600; color: #4f573d; letter-spacing: 0.02em;
                }
                .lao-ornament {
                  display: flex; align-items: center; gap: 0.6rem;
                  width: 140px; color: #96a184; font-size: 0.68rem;
                }
                .lao-ornament span {
                  flex: 1; height: 1px;
                  background: linear-gradient(90deg, transparent, rgba(127, 140, 114, 0.55), transparent);
                }
                .lao-ornament i { font-style: normal; }
                .lao-tabs {
                  display: inline-flex; align-items: center; gap: 0.25rem;
                  padding: 0.22rem; border-radius: 999px;
                  background: rgba(168, 181, 155, 0.18);
                  border: 1px solid rgba(127, 140, 114, 0.22);
                }
                .lao-tab-btn {
                  position: relative; border: 0; background: none;
                  padding: 0.34rem 0.85rem; border-radius: 999px;
                  font-family: inherit; font-size: clamp(0.7rem, 1.9vw, 0.82rem);
                  color: #667055; cursor: pointer; transition: color 0.2s ease;
                }
                .lao-tab-btn.is-active { color: #faf7ef; font-weight: 500; }
                .lao-tab-pill {
                  position: absolute; inset: 0; border-radius: 999px;
                  background: #6f7c60; box-shadow: 0 3px 10px rgba(80, 90, 66, 0.25); z-index: 0;
                }
                .lao-tab-label { position: relative; z-index: 1; }
                .lao-hosts-grid {
                  width: 100%; display: grid; grid-template-columns: 1fr; gap: 0.75rem 1.25rem;
                }
                @media (min-width: 768px) {
                  .lao-hosts-grid { grid-template-columns: 1fr 1fr; }
                  .lao-hosts-grid.is-single { grid-template-columns: minmax(0, 520px); justify-content: center; }
                }
                .lao-host-group {
                  background: rgba(255, 255, 255, 0.58);
                  border: 1px solid rgba(127, 140, 114, 0.2);
                  border-radius: 12px; padding: 0.65rem 0.75rem;
                  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
                  transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .lao-host-group:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 10px 24px rgba(80, 90, 66, 0.1);
                }
                .lao-host-heading {
                  margin: 0; display: inline-flex; align-items: center; gap: 0.4rem;
                  font-size: clamp(0.84rem, 2.2vw, 0.98rem); font-weight: 600; color: #4f573d;
                }
                .lao-host-dot { width: 6px; height: 6px; border-radius: 50%; background: #8b987b; }
                .lao-host-list { width: 100%; display: flex; flex-direction: column; gap: 0.18rem; }
                .lao-host-row {
                  display: grid; grid-template-columns: 1fr 1.15fr; gap: 0.4rem;
                  text-align: left; font-size: clamp(0.66rem, 1.85vw, 0.82rem);
                  line-height: 1.45; color: #555e43; padding: 0.12rem 0.28rem;
                  border-radius: 6px; transition: background-color 0.2s ease;
                }
                .lao-host-row:hover { background: rgba(168, 181, 155, 0.16); }
                .lao-host-row-full { grid-template-columns: 1fr; }
                .lao-invite-message {
                  display: flex; flex-direction: column; gap: 0.12rem;
                  font-size: clamp(0.72rem, 2vw, 0.88rem); line-height: 1.5; color: #5c6348;
                }
                .lao-invite-message p { margin: 0; }
                .lao-couple-block {
                  width: 100%; max-width: 680px;
                  background: linear-gradient(180deg, rgba(168, 181, 155, 0.16) 0%, rgba(168, 181, 155, 0.06) 100%);
                  border: 1px solid rgba(127, 140, 114, 0.28);
                  border-radius: 14px; padding: 0.75rem 0.95rem;
                  display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
                }
                .lao-couple-names {
                  margin: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
                  gap: 0.3rem 0.6rem; font-size: clamp(0.95rem, 3vw, 1.32rem);
                  font-weight: 600; color: #464e35; line-height: 1.38;
                }
                .lao-couple-amp {
                  display: inline-grid; place-items: center; padding: 0.08rem 0.5rem;
                  border-radius: 999px; background: rgba(127, 140, 114, 0.2);
                  font-size: 0.76em; font-weight: 500; color: #5c6348;
                }
                .lao-couple-eng {
                  margin: 0; font-family: Georgia, "Times New Roman", serif;
                  font-size: clamp(0.6rem, 1.7vw, 0.8rem); letter-spacing: 0.18em;
                  text-transform: uppercase; color: #747c61;
                }
                .lao-event-meta {
                  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.48rem;
                }
                .lao-event-date {
                  margin: 0; font-size: clamp(0.95rem, 2.7vw, 1.18rem); font-weight: 700; color: #464e35;
                }
                .lao-event-times {
                  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.55rem;
                }
                .lao-time-card {
                  display: inline-flex; align-items: center; gap: 0.45rem;
                  padding: 0.38rem 0.9rem; border-radius: 999px;
                  border: 1px solid rgba(127, 140, 114, 0.35);
                  background: rgba(255, 255, 255, 0.72);
                  font-family: inherit; font-size: clamp(0.76rem, 2.1vw, 0.92rem);
                  color: #4f573d; cursor: pointer; transition: all 0.2s ease;
                }
                .lao-time-card:hover { border-color: #6f7c60; transform: translateY(-1px); }
                .lao-time-card.is-selected {
                  background: #6f7c60; border-color: #6f7c60; color: #faf7ef;
                  box-shadow: 0 6px 16px rgba(80, 90, 66, 0.22);
                }
                .lao-time-clock { font-weight: 700; font-variant-numeric: tabular-nums; }
                .lao-ceremony-detail {
                  margin: 0; font-size: clamp(0.7rem, 1.9vw, 0.82rem); color: #6b7357; min-height: 1.3em;
                }
                .lao-event-venue {
                  margin: 0; font-size: clamp(0.78rem, 2.1vw, 0.94rem); font-weight: 500; color: #4f573d;
                }
                .lao-action-bar {
                  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
                  gap: 0.55rem; margin-top: 0.15rem;
                }
                .lao-action-btn {
                  display: inline-flex; align-items: center; gap: 0.42rem;
                  padding: 0.44rem 1rem; border-radius: 999px;
                  font-size: clamp(0.72rem, 1.9vw, 0.84rem); font-weight: 500;
                  text-decoration: none;
                  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                }
                .lao-action-btn:hover { transform: translateY(-2px); }
                .lao-action-primary {
                  background: #5c664c; color: #faf7ef;
                  box-shadow: 0 8px 20px rgba(72, 82, 58, 0.22);
                }
                .lao-action-primary:hover { background: #4e5740; }
                .lao-action-secondary {
                  background: rgba(255, 255, 255, 0.78); color: #4f573d;
                  border: 1px solid rgba(127, 140, 114, 0.4);
                }
                .lao-action-secondary:hover { background: #ffffff; }
                .section-location {
                  font-family: var(--font-lao), "Noto Sans Lao Looped", "Phetsarath OT", sans-serif;
                  color: #4f573d;
                  padding: 1.5rem 0.85rem;
                  overflow: hidden;
                  background:
                    radial-gradient(circle at 85% 15%, rgba(168, 181, 155, 0.28), transparent 45%),
                    radial-gradient(circle at 15% 85%, rgba(168, 181, 155, 0.24), transparent 45%);
                }
                .location-card-shell {
                  position: relative;
                  z-index: 1;
                  width: 100%;
                  max-width: 760px;
                  background: rgba(250, 247, 239, 0.9);
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(127, 140, 114, 0.35);
                  border-radius: 20px;
                  padding: 6px;
                  box-shadow: 0 24px 60px rgba(72, 82, 58, 0.14), 0 2px 8px rgba(72, 82, 58, 0.06);
                }
                .location-card-inner {
                  width: 100%;
                  border: 1px solid rgba(127, 140, 114, 0.24);
                  border-radius: 15px;
                  padding: clamp(1.25rem, 3vw, 2.2rem) clamp(1rem, 2.8vw, 2.2rem);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 1rem;
                }
                .location-pin-badge {
                  width: 46px; height: 46px; border-radius: 50%;
                  border: 1px solid rgba(127, 140, 114, 0.5);
                  background: radial-gradient(circle, #faf7ef 0%, #e9e3d2 100%);
                  display: grid; place-items: center;
                  color: #5c664c; font-size: 1.2rem;
                  box-shadow: 0 6px 16px rgba(80, 90, 66, 0.15);
                }
                .location-venue-box {
                  display: flex; flex-direction: column; align-items: center; gap: 0.28rem;
                }
                .location-venue-lao {
                  margin: 0; font-size: clamp(1.1rem, 3.3vw, 1.5rem);
                  font-weight: 600; color: #464e35; line-height: 1.4;
                }
                .location-venue-eng {
                  margin: 0; font-family: Georgia, "Times New Roman", serif;
                  font-size: clamp(0.75rem, 2vw, 0.95rem);
                  letter-spacing: 0.12em; text-transform: uppercase; color: #6e775c;
                }
                .location-venue-address {
                  margin: 0; font-size: clamp(0.76rem, 2vw, 0.88rem); color: #747c61;
                }
                .location-schedule-chips {
                  display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;
                }
                .location-chip {
                  display: inline-flex; align-items: center; gap: 0.4rem;
                  padding: 0.34rem 0.85rem; border-radius: 999px;
                  background: rgba(168, 181, 155, 0.18);
                  border: 1px solid rgba(127, 140, 114, 0.26);
                  font-size: clamp(0.74rem, 2vw, 0.86rem); color: #4f573d;
                }
                .location-map-frame {
                  width: 100%; height: clamp(200px, 32vh, 280px);
                  border-radius: 14px; overflow: hidden;
                  border: 1px solid rgba(127, 140, 114, 0.32);
                  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);
                  background: #e9e4d8;
                }
                .location-map-frame iframe {
                  width: 100%; height: 100%; border: 0; display: block;
                  filter: saturate(0.85) contrast(0.98);
                }
                .lao-action-btn-button {
                  cursor: pointer; font-family: inherit;
                }
              `}</style>
              <Image
                src={images.lilly1}
                alt=""
                width={290}
                height={922}
                className="lao-botanical lao-botanical-left"
                aria-hidden="true"
              />
              <Image
                src={images.lilly2}
                alt=""
                width={422}
                height={980}
                className="lao-botanical lao-botanical-right"
                aria-hidden="true"
              />

              <motion.div className="lao-card-shell" {...sectionReveal}>
                <div className="lao-card-inner">
                  {/* Top Monogram Seal & Header */}
                  <div className="lao-header">
                    <span className="lao-crest" aria-hidden="true">
                      {invitation.shortNames}
                    </span>
                    <p className="lao-eyebrow">WEDDING INVITATION</p>
                    <h2 className="lao-title">{invitation.laoCard.title}</h2>
                    <div className="lao-ornament" aria-hidden="true">
                      <span />
                      <i>♥</i>
                      <span />
                    </div>
                  </div>

                  {/* Interactive Host Filter Tabs */}
                  <div
                    className="lao-tabs"
                    role="tablist"
                    aria-label="เลือกดูรายชื่อเจ้าภาพ"
                  >
                    {(
                      [
                        { id: "both", label: "ທັງສອງຝ່າຍ" },
                        {
                          id: "groom",
                          label: invitation.laoCard.groomHostsTitle,
                        },
                        {
                          id: "bride",
                          label: invitation.laoCard.brideHostsTitle,
                        },
                      ] as const
                    ).map((tab) => {
                      const active = hostTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`lao-tab-btn${active ? " is-active" : ""}`}
                          onClick={() => setHostTab(tab.id)}
                        >
                          {active && (
                            <motion.span
                              layoutId="host-tab-pill"
                              className="lao-tab-pill"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                          <span className="lao-tab-label">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Animated Host Cards */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hostTab}
                      className={`lao-hosts-grid${hostTab !== "both" ? " is-single" : ""}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      {(hostTab === "both" || hostTab === "groom") && (
                        <div className="lao-host-group">
                          <h3 className="lao-host-heading">
                            <span className="lao-host-dot" aria-hidden="true" />
                            {invitation.laoCard.groomHostsTitle}
                          </h3>
                          <div className="lao-host-list">
                            {invitation.laoCard.groomHosts.map((row, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.25,
                                  delay: idx * 0.04,
                                }}
                                className={`lao-host-row${row.right ? "" : " lao-host-row-full"}`}
                              >
                                <span>{row.left}</span>
                                {row.right && <span>{row.right}</span>}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(hostTab === "both" || hostTab === "bride") && (
                        <div className="lao-host-group">
                          <h3 className="lao-host-heading">
                            <span className="lao-host-dot" aria-hidden="true" />
                            {invitation.laoCard.brideHostsTitle}
                          </h3>
                          <div className="lao-host-list">
                            {invitation.laoCard.brideHosts.map((row, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.25,
                                  delay: idx * 0.04,
                                }}
                                className="lao-host-row"
                              >
                                <span>{row.left}</span>
                                <span>{row.right}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Invitation Message */}
                  <div className="lao-invite-message">
                    <p>{invitation.laoCard.inviteLine1}</p>
                    <p>{invitation.laoCard.inviteLine2}</p>
                  </div>

                  {/* Highlighted Couple Showcase */}
                  <motion.div
                    className="lao-couple-block"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div className="lao-couple-names">
                      <span>{invitation.laoCard.groomNameLao}</span>
                      <span className="lao-couple-amp" aria-hidden="true">
                        ແລະ
                      </span>
                      <span>{invitation.laoCard.brideNameLao}</span>
                    </div>
                    <p className="lao-couple-eng">
                      {invitation.laoCard.coupleEng}
                    </p>
                  </motion.div>

                  {/* Interactive Schedule & Venue */}
                  <div className="lao-event-meta">
                    <p className="lao-event-date">
                      {invitation.laoCard.dateLao}
                    </p>

                    <div
                      className="lao-event-times"
                      role="group"
                      aria-label="กำหนดการพิธี"
                    >
                      <button
                        type="button"
                        className={`lao-time-card${activeCeremony === "baci" ? " is-selected" : ""}`}
                        onClick={() => setActiveCeremony("baci")}
                      >
                        <FiClock aria-hidden="true" />
                        <span className="lao-time-clock">
                          {invitation.laoCard.ceremonyLeft.time}
                        </span>
                        <span className="lao-time-label">
                          {invitation.laoCard.ceremonyLeft.label}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`lao-time-card${activeCeremony === "reception" ? " is-selected" : ""}`}
                        onClick={() => setActiveCeremony("reception")}
                      >
                        <FiClock aria-hidden="true" />
                        <span className="lao-time-clock">
                          {invitation.laoCard.ceremonyRight.time}
                        </span>
                        <span className="lao-time-label">
                          {invitation.laoCard.ceremonyRight.label}
                        </span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeCeremony}
                        className="lao-ceremony-detail"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeCeremony === "baci"
                          ? invitation.laoCard.ceremonyLeft.detail
                          : invitation.laoCard.ceremonyRight.detail}
                      </motion.p>
                    </AnimatePresence>

                    {/* Website Action Button: Save Date */}
                    <div className="lao-action-bar">
                      <a
                        href={invitation.laoCard.calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lao-action-btn lao-action-primary"
                      >
                        <FiCalendar aria-hidden="true" />
                        <span>ບັນທຶກວັນງານ</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 4 — Location & Venue */}
            <section className="snap-section section-location">
              <Image
                src={images.lilly2}
                alt=""
                width={422}
                height={980}
                className="lao-botanical lao-botanical-left"
                aria-hidden="true"
              />
              <Image
                src={images.lilly1}
                alt=""
                width={290}
                height={922}
                className="lao-botanical lao-botanical-right"
                aria-hidden="true"
              />

              <motion.div className="location-card-shell" {...sectionReveal}>
                <div className="location-card-inner">
                  <div className="lao-header">
                    <span className="location-pin-badge" aria-hidden="true">
                      <FiMapPin />
                    </span>
                    <p className="lao-eyebrow">LOCATION &amp; VENUE</p>
                    <h2 className="lao-title">ສະຖານທີ່ຈັດງານ</h2>
                    <div className="lao-ornament" aria-hidden="true">
                      <span />
                      <i>♥</i>
                      <span />
                    </div>
                  </div>

                  <div className="location-venue-box">
                    <p className="location-venue-lao">
                      {invitation.laoCard.venueTitleLao}
                    </p>
                    <p className="location-venue-eng">
                      {invitation.laoCard.venueTitleEng}
                    </p>
                    <p className="location-venue-address">
                      {invitation.laoCard.venueAddressLao}
                    </p>
                  </div>

                  <div className="location-schedule-chips">
                    <span className="location-chip">
                      <FiCalendar aria-hidden="true" />
                      <span>{invitation.laoCard.dateLao}</span>
                    </span>
                    <span className="location-chip">
                      <FiClock aria-hidden="true" />
                      <span>
                        {invitation.laoCard.ceremonyLeft.time}{" "}
                        {invitation.laoCard.ceremonyLeft.label} ·{" "}
                        {invitation.laoCard.ceremonyRight.time}{" "}
                        {invitation.laoCard.ceremonyRight.label}
                      </span>
                    </span>
                  </div>

                  <div className="location-map-frame">
                    <iframe
                      title="ແຜນທີ່ ໂຮງແຮມ ແລນມາກ ແມ່ຂອງຮີເວີໄຊທ໌"
                      src={invitation.laoCard.venueEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="lao-action-bar">
                    <a
                      href={invitation.laoCard.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lao-action-btn lao-action-primary"
                    >
                      <FiNavigation aria-hidden="true" />
                      <span>ເປີດ Google Maps ນຳທາງ</span>
                    </a>

                    <button
                      type="button"
                      onClick={copyVenue}
                      className="lao-action-btn lao-action-secondary lao-action-btn-button"
                    >
                      {copiedVenue ? (
                        <>
                          <FiCheck aria-hidden="true" />
                          <span>ຄັດລອກຊື່ສະຖານທີ່ແລ້ວ</span>
                        </>
                      ) : (
                        <>
                          <FiCopy aria-hidden="true" />
                          <span>ຄັດລອກຊື່ສະຖານທີ່</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 4 — Wedding details */}
            {/* <section className="snap-section section-details">
              <motion.div className="section-inner" {...sectionReveal}>
                <div className="tray-composition">
                  <Image
                    src="/images/plate.png"
                    alt=""
                    width={1856}
                    height={2304}
                    sizes="(max-width: 640px) 88vw, 420px"
                    className="tray-image"
                  />
                  <div className="tray-text">
                    <p className="explore-script">Wedding Details</p>
                    <button
                      type="button"
                      className="explore-link"
                      onClick={() => setOverlay("details")}
                    >
                      Explore Here
                    </button>
                  </div>
                </div>
              </motion.div>
            </section> */}

            {/* Section 5 — Our love story */}
            {/* <section className="snap-section section-story">
              <motion.div className="section-inner" {...sectionReveal}>
                <div className="pillow-composition">
                  <Image
                    src="/images/square.png"
                    alt=""
                    width={1792}
                    height={2400}
                    sizes="(max-width: 640px) 78vw, 380px"
                    className="pillow-image"
                  />
                  <div className="pillow-text">
                    <p className="explore-script">Our Love Story</p>
                    <button
                      type="button"
                      className="explore-link"
                      onClick={() => setOverlay("story")}
                    >
                      Explore Here
                    </button>
                  </div>
                </div>
              </motion.div>
            </section> */}

            {/* Section 6 — With love */}
            {/* <section className="snap-section section-outro">
              <motion.div className="section-inner" {...sectionReveal}>
                <p className="outro-eyebrow">With love</p>
                <p className="outro-monogram" aria-hidden="true">
                  {invitation.shortNames}
                </p>
                <p className="outro-note">
                  Should you have any questions, please get in touch with the
                  bride and the groom via email.
                </p>
                <p className="outro-email">{invitation.contact}</p>
                <button
                  type="button"
                  className="return-link"
                  onClick={() => setPhase("closed")}
                >
                  Return
                </button>
              </motion.div>
            </section> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explore overlays */}
      <AnimatePresence>
        {overlay === "details" && (
          <motion.div
            key="overlay-details"
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOverlay(null)}
          >
            <motion.div
              className="overlay-card"
              role="dialog"
              aria-modal="true"
              aria-label="Wedding details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Wedding Details</h2>
              <p className="overlay-date">{invitation.date}</p>
              <p className="overlay-meta">
                {invitation.time} · {invitation.venue}
              </p>
              <ul className="schedule-list">
                {invitation.schedule.map((item) => (
                  <li key={item.time} className="schedule-item">
                    <span className="schedule-time">{item.time}</span>
                    <span className="schedule-body">
                      <strong>{item.title}</strong>
                      <small>{item.note}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="dress-note">{invitation.dressCode}</p>
              <button
                type="button"
                className="return-link"
                onClick={() => setOverlay(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {overlay === "story" && (
          <motion.div
            key="overlay-story"
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOverlay(null)}
          >
            <motion.div
              className="overlay-card"
              role="dialog"
              aria-modal="true"
              aria-label="Our love story"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Our Love Story</h2>
              <figure className="story-photo">
                <Image
                  src="/images/couple-2.png"
                  alt="ภาพคู่บ่าวสาว"
                  width={1362}
                  height={2048}
                  sizes="(max-width: 720px) 70vw, 320px"
                />
              </figure>
              <p className="story-text">{invitation.loveStory}</p>
              <button
                type="button"
                className="return-link"
                onClick={() => setOverlay(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
