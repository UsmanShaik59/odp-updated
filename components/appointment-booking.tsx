"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  MapPin,
  Menu,
  Smartphone,
  X,
} from "lucide-react";
import { properties } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { PropertyAssistant } from "./property-assistant";

type Property = (typeof properties)[number];

const slots = ["9AM", "10AM", "11AM", "12PM", "2PM", "4PM"];

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppointmentBooking({ property }: { property: Property }) {
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"sent" | "failed" | null>(
    null,
  );
  const supabase = useMemo(() => createClient(), []);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());

    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentTimeText = currentTime
    ? currentTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  const propertyIndex = properties.findIndex(
    (item) => item.title === property.title,
  );
  const propertyHref = `/properties/${propertyIndex}`;
  const venue = `${property.location.split(",")[0]} Experience Centre`;
  const formattedDate = useMemo(() => {
    if (!date) return "Choose a date";
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(
      new Date(`${date}T12:00:00`),
    );
  }, [date]);

  const canConfirm = Boolean(
    customerName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) &&
    /^\d{10}$/.test(mobileNumber) &&
    date &&
    selectedSlot,
  );

  const confirmAppointment = async () => {
    if (!canConfirm || isSubmitting) {
      setBookingError(
        "Enter your name, a valid email address, a valid 10-digit mobile number, date and time.",
      );
      return;
    }

    setBookingError("");
    setIsSubmitting(true);

    if (!supabase) {
      setBookingError(
        "Appointment booking is unavailable until the property database is connected.",
      );
      setIsSubmitting(false);
      return;
    }

    let bookingStage = "checking session";

    try {
      // Guest booking is allowed. If a customer happens to be signed in,
      // associate the booking with their account; otherwise use null.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const user = session?.user ?? null;

      bookingStage = "saving enquiry";
      const { data: enquiry, error: enquiryError } = await supabase
        .from("enquiries")
        .insert({
          property_id: String(propertyIndex),
          customer_id: user?.id ?? null,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          message: `Appointment request for ${property.title}. Contact mobile: ${mobileNumber}. Preferred date: ${date}. Preferred time: ${selectedSlot}.`,
        })
        .select("id")
        .single();

      if (enquiryError || !enquiry) {
        throw enquiryError ?? new Error("Could not create the enquiry.");
      }

      bookingStage = "saving appointment";
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          enquiry_id: enquiry.id,
          property_id: String(propertyIndex),
          customer_id: user?.id ?? null,
          appointment_date: date,
          appointment_time: selectedSlot,
          venue,
        });

      if (appointmentError) throw appointmentError;

      // Send the admin email only after both the enquiry and appointment
      // have been saved successfully. Email failure must not undo a booking.
      bookingStage = "sending notification email";
      try {
        const { data: emailData, error: emailError } =
          await supabase.functions.invoke("send-booking-email", {
            body: {
              name: customerName.trim(),
              email: customerEmail.trim(),
              phone: mobileNumber,
              propertyTitle: property.title,
              property: property.title,
              preferredDate: date,
              date,
              appointmentTime: selectedSlot,
              preferredTime: selectedSlot,
              venue,
              message: `Customer: ${customerName.trim()}. Email: ${customerEmail.trim()}. Phone: ${mobileNumber}. Property: ${property.title}. Preferred date: ${date}. Preferred time: ${selectedSlot}. Venue: ${venue}.`,
            },
          });

        if (emailError) {
          setEmailStatus("failed");
          console.error(
            "Appointment saved, but booking email function failed:",
            emailError,
          );
        } else if (emailData?.customerConfirmationSent === true) {
          setEmailStatus("sent");
        } else {
          setEmailStatus("failed");
          console.warn(
            "Appointment was saved, but the function did not confirm that the customer email was sent.",
            emailData,
          );
        }
      } catch (emailError) {
        setEmailStatus("failed");
        console.error(
          "Appointment saved, but booking email function failed:",
          emailError,
        );
      }

      setConfirmed(true);
    } catch (error) {
      // Supabase/PostgREST errors may appear as {} when logged directly.
      // Log their useful fields so the actual cause can be identified.
      const details =
        error && typeof error === "object"
          ? (error as {
              name?: string;
              message?: string;
              code?: string;
              details?: string;
              hint?: string;
              status?: number;
            })
          : { message: String(error) };

      console.error("Appointment booking failed:", {
        stage: bookingStage,
        name: details.name,
        message: details.message,
        code: details.code,
        details: details.details,
        hint: details.hint,
        status: details.status,
        rawError: error,
      });

      setBookingError(
        bookingStage === "saving enquiry" ||
          bookingStage === "saving appointment"
          ? "We couldn't save your appointment. Please check your Supabase table columns and guest-booking RLS policies, then try again."
          : "We could not reserve your appointment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <PageShell>
        <main className="mx-auto mt-15 flex min-h-[75vh] w-full items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100 text-black">
              <Check size={24} />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950">
              Request received!
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Your visit request for{" "}
              <span className="font-medium text-neutral-950">
                {property.title}
              </span>{" "}
              has been saved. Our team will contact you to confirm the
              appointment.
            </p>

            <div className="mt-5 space-y-3 rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Date</span>
                <span className="text-right font-medium text-neutral-900">
                  {formattedDate}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Time</span>
                <span className="font-medium text-neutral-900">
                  {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Venue</span>
                <span className="max-w-[60%] text-right font-medium text-neutral-900">
                  {venue}
                </span>
              </div>
            </div>

            <p
              role="status"
              aria-live="polite"
              className="mt-4 text-xs leading-5 text-neutral-500"
            >
              {emailStatus === "sent"
                ? "A request email was accepted by the email service. Final appointment confirmation is still pending."
                : "Your request is saved. we will get in touch with you."}
            </p>

            <Link
              href={propertyHref}
              className="group relative mt-5 ml-25 inline-flex h-9 w-full max-w-[200px] min-w-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-[#152b43] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(207,117,68,0.10)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#cf7544] min-[380px]:w-[min(180px,calc(50vw-24px))] min-[380px]:flex-none lg:h-10 lg:gap-2 lg:px-3 lg:text-xs"
            >
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="0.75"
                  y="0.75"
                  width="198.5"
                  height="38.5"
                  rx="19.25"
                  stroke="#c8dff4"
                  strokeWidth="1.5"
                />
                <rect
                  x="0.75"
                  y="0.75"
                  width="198.5"
                  height="38.5"
                  rx="19.25"
                  pathLength="100"
                  stroke="#cf7544"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="18 82"
                  className="[filter:drop-shadow(0_0_2px_#cf7544)]"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-100"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>

              <ArrowLeft
                size={13}
                className="relative z-10 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span className="relative z-10">Return to property</span>
            </Link>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-[82px] sm:px-6 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#cf7544]">
              One step ahead !
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#152b43] sm:text-6xl">
              See your next home in person.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#5f6368]">
              Choose a convenient date and time for a private visit. Our
              property specialist will meet you at the location below.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-[#152b43]">
                Full Name
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="h-12 rounded-xl border border-[#cbd8e1] !bg-white px-4 font-normal !text-black caret-black outline-none transition-all duration-200 placeholder:!text-[#91a0af] focus:!bg-white focus:border-[#cf7544] focus:ring-2 focus:ring-[#cf7544]/15 autofill:!bg-white autofill:!text-black"
                  style={{
                    WebkitTextFillColor: "#000000",
                    WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
                  }}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#152b43]">
                Email Address
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={254}
                  className="h-12 rounded-xl border border-[#cbd8e1] !bg-white px-4 font-normal !text-black caret-black outline-none transition-all duration-200 placeholder:!text-[#91a0af] focus:!bg-white focus:border-[#cf7544] focus:ring-2 focus:ring-[#cf7544]/15 autofill:!bg-white autofill:!text-black"
                  style={{
                    WebkitTextFillColor: "#000000",
                    WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
                  }}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#152b43]">
                Mobile Number
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(event) =>
                    setMobileNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  className="h-12 rounded-xl border border-[#cbd8e1] !bg-white px-4 font-normal !text-black caret-black outline-none transition-all duration-200 placeholder:!text-[#91a0af] focus:!bg-white focus:border-[#cf7544] focus:ring-2 focus:ring-[#cf7544]/15 autofill:!bg-white autofill:!text-black"
                  style={{
                    WebkitTextFillColor: "#000000",
                    WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
                  }}
                />
              </label>
            </div>

            {/* Appointment Date & Time Selection */}
            <div className="mt-10 grid items-start gap-6 xl:grid-cols-2">
              {/* Full Calendar */}
              <div className="rounded-2xl border border-[#dceaf7]  p-5  sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[#cf7544]">
                    <CalendarDays size={21} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#152b43]">
                      Choose a date
                    </h3>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-[#152b43]">
                    {new Intl.DateTimeFormat("en-IN", {
                      month: "long",
                      year: "numeric",
                    }).format(calendarMonth)}
                  </h4>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous month"
                      disabled={
                        calendarMonth.getFullYear() ===
                          new Date().getFullYear() &&
                        calendarMonth.getMonth() <= new Date().getMonth()
                      }
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                      className="flex size-9 items-center justify-center rounded-lg border border-[#dce5eb] text-[#152b43] transition-all duration-200 hover:border-[#cf7544] hover:bg-[#fff0e5] hover:text-[#cf7544] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setCalendarMonth(
                          new Date(
                            calendarMonth.getFullYear(),
                            calendarMonth.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                      className="flex size-9 items-center justify-center rounded-lg border border-[#dce5eb] text-[#152b43] transition-all duration-200 hover:border-[#cf7544] hover:bg-[#fff0e5] hover:text-[#cf7544] active:scale-95"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-7 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="pb-3 text-[11px] font-semibold text-[#8292a3] sm:text-xs"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {Array.from(
                    {
                      length:
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          1,
                        ).getDay() +
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() + 1,
                          0,
                        ).getDate(),
                    },
                    (_, index) => {
                      const firstDay = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        1,
                      ).getDay();

                      const day = index - firstDay + 1;

                      if (day < 1) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="aspect-square"
                          />
                        );
                      }

                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const currentDate = new Date(year, month, day);
                      currentDate.setHours(0, 0, 0, 0);

                      const disabled = currentDate < today;
                      const selected = date === value;
                      const isToday = currentDate.getTime() === today.getTime();

                      return (
                        <div
                          key={value}
                          className="flex aspect-square items-center justify-center p-0.5"
                        >
                          <button
                            type="button"
                            disabled={disabled}
                            aria-pressed={selected}
                            aria-label={`Select ${day} ${new Intl.DateTimeFormat("en-IN", { month: "long" }).format(calendarMonth)} ${year}`}
                            onClick={() => {
                              setDate(value);
                              setBookingError("");
                            }}
                            className={`relative flex size-full max-h-11 max-w-11 items-center justify-center rounded-xl text-sm transition-all duration-200 active:scale-90 ${
                              selected
                                ? "scale-100 bg-[#f0a879] font-semibold text-[#542d18] shadow-[0_5px_14px_rgba(207,117,68,0.2)]"
                                : disabled
                                  ? "cursor-not-allowed text-[#c5ced7]"
                                  : isToday
                                    ? "border border-[#cf7544] font-semibold text-[#cf7544] hover:bg-[#fff0e5]"
                                    : "text-[#152b43] hover:bg-[#fff0e5] hover:text-[#cf7544]"
                            }`}
                          >
                            {day}
                            {isToday && !selected && (
                              <span className="absolute bottom-1 size-1 rounded-full bg-[#cf7544]" />
                            )}
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#edf2f7] pt-4 text-xs text-[#718195]">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded-md bg-[#cf7544]" />
                    Selected
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded-md border border-[#cf7544]" />
                    Today
                  </span>
                  <span className="ml-auto text-right font-medium text-[#152b43]">
                    {date
                      ? new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(`${date}T12:00:00`))
                      : "No date selected"}
                  </span>
                </div>
              </div>

              {/* Time Slots and live clock */}
              <div className="min-w-0 rounded-2xl border border-[#dceaf7]  duration-300  sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl  text-[#cf7544]">
                    <Clock3 size={21} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#152b43]">
                      Choose a time
                    </h3>
                  </div>
                </div>

                {/* Live clock: centered and separated from selectable slots */}
                <div className="mt-5 flex items-center justify-center gap-5 rounded-2xl border px-4 py-5 sm:gap-6">
                  <div className="relative size-[104px] shrink-0 rounded-full border-[5px] border-[#dceaf7] bg-white shadow-inner">
                    {Array.from({ length: 12 }, (_, i) => (
                      <span
                        key={i}
                        className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full ${i % 3 === 0 ? "bg-[#152b43]" : "bg-[#9aabba]"}`}
                        style={{
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-42px)`,
                        }}
                      />
                    ))}
                    {currentTime && (
                      <>
                        <span
                          className="absolute left-1/2 top-1/2 h-[25px] w-[4px] origin-bottom rounded-full bg-[#152b43]"
                          style={{
                            transform: `translate(-50%, -100%) rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)`,
                          }}
                        />
                        <span
                          className="absolute left-1/2 top-1/2 h-[34px] w-[3px] origin-bottom rounded-full bg-[#cf7544]"
                          style={{
                            transform: `translate(-50%, -100%) rotate(${currentTime.getMinutes() * 6 + currentTime.getSeconds() * 0.1}deg)`,
                          }}
                        />
                        <span
                          className="absolute left-1/2 top-1/2 h-[38px] w-px origin-bottom bg-red-500"
                          style={{
                            transform: `translate(-50%, -100%) rotate(${currentTime.getSeconds() * 6}deg)`,
                          }}
                        />
                        <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#cf7544]" />
                      </>
                    )}
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2 shrink-0">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                    </div>
                    <p className="mt-2 whitespace-nowrap text-xs font-bold tabular-nums tracking-tight text-[#152b43] sm:text-lg">
                      {currentTimeText}
                    </p>
                    <p className="mt-1 text-xs text-[#718195]">
                      {currentTime
                        ? currentTime.toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          })
                        : "Loading clock..."}
                    </p>
                  </div>
                </div>

                {/* Available time slots */}
                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718195]">
                      Available time slots
                    </p>
                    <span className="rounded-full bg-[#fff0e5] px-2.5 py-1 text-xs font-semibold text-[#cf7544]">
                      {slots.length} slots
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {slots.map((slot) => {
                      const selected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setBookingError("");
                          }}
                          className={`flex min-h-12 min-w-0 items-center justify-between gap-2 rounded-xl border px-3 text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] ${
                            selected
                              ? "border-[#cf7544] bg-[#f0a879] font-semibold text-[#542d18] shadow-[0_6px_16px_rgba(207,117,68,0.2)]"
                              : "border-[#dce5eb] bg-white font-medium text-[#152b43] hover:border-[#cf7544] hover:bg-[#f4f9fe] hover:text-[#cf7544]"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Clock3 size={15} className="shrink-0" />
                            <span className="whitespace-nowrap">{slot}</span>
                          </span>
                          {selected && <Check size={15} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit overflow-hidden rounded-2xl  p-4  sm:p-5 lg:sticky lg:top-24">
            <div className="relative aspect-[1.45/1] overflow-hidden rounded-xl ">
              <Image
                src={property.image}
                alt={`${property.title} exterior`}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#cf7544] shadow-sm">
                {property.status}
              </span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#cf7544]">
              Selected property
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#152b43]">
              {property.title}
            </h2>
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-[#5f6368]">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#cf7544]" />
              {property.location}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#e5edf5] pt-4 text-sm">
              <span className="text-[#5f6368]">Starting price</span>
              <strong className="text-right text-base text-[#cf7544]">
                {property.price}
              </strong>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl  p-4 ">
              {/* Venue heading */}
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[#cf7544]">
                  <MapPin size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718195]">
                    Appointment venue
                  </p>
                  {/* <p className="mt-1 font-semibold text-[#152b43]">{venue}</p> */}
                </div>
              </div>

              {/* Mini Google Map */}
              <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-[#dceaf7] bg-[#f4f8fc] sm:h-48">
                <iframe
                  title={`Map showing ${property.location}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=14&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open venue in Google Maps"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-[#dce5eb] bg-white px-3 py-2 text-xs font-semibold text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cf7544] hover:shadow-md"
                >
                  Open map
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Venue address */}
              <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#5f6368]">
                <MapPin size={16} className="mt-1 shrink-0 text-[#cf7544]" />
                <span>{property.location}</span>
              </p>

              {/* Directions button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#cf7544] bg-white px-3 py-2 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(207,117,68,0.10)] active:scale-[0.97]"
              >
                <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#cf7544] [clip-path:inset(0_100%_0_0)] transition-all duration-500 ease-out group-hover:[clip-path:inset(0_0_0_0)]" />
                <span className="relative z-10">Get directions</span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
            {bookingError && (
              <p
                role="alert"
                className="mt-5 max-w-xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-[#b42318]"
              >
                {bookingError}
              </p>
            )}
            <button
              type="button"
              disabled={!canConfirm || isSubmitting}
              onClick={confirmAppointment}
              className="
    group mt-8 flex h-14 w-60 ml-25 items-center
    justify-center gap-2 rounded-xl
    border border-[#cf7544] bg-white px-5
    text-sm font-semibold text-[#cf7544]
    transition-all duration-300
    hover:bg-[#cf7544] hover:text-white
    active:scale-[0.99] cursor-pointer 
    disabled:border-[#d5e2ec]
    disabled:bg-[#f4f8fb]
    disabled:text-[#9aafbf]
    disabled:active:scale-100
  "
            >
              {isSubmitting
                ? "Submitting request..."
                : canConfirm
                  ? "Confirm appointment"
                  : "Fill all the fields"}

              {!isSubmitting && (
                <ArrowRight
                  size={16}
                  className="
        transition-transform duration-300
        group-hover:translate-x-1
      "
                />
              )}
            </button>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fff0e5] text-[#cf7544]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.12em] text-[#718195]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-[#152b43]">
          {value}
        </p>
      </div>
    </div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/#properties" },
    { label: "Locations", href: "/#locations" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const mobileItems = [
    { label: "Home", href: "/", icon: Building2 },
    { label: "Buy Flats", href: "/#properties", icon: BedDouble },
    { label: "Properties", href: "/#properties", icon: Building2 },
    { label: "Locations", href: "/#locations", icon: MapPin },
    { label: "About Us", href: "/about", icon: Smartphone },
    { label: "Contact", href: "/contact", icon: Headphones },
  ];

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const sectionId = href.split("#")[1];
    if (!sectionId || window.location.pathname !== "/") return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${sectionId}`);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#152b43]">
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#fff0e5] text-[#152b43] shadow-[0_2px_12px_rgba(21,43,67,0.06)]">
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#edd0bb] bg-white/70 text-[#152b43] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center text-[#cf7544] transition-transform duration-200 hover:scale-[1.03]"
            aria-label="OneStep Dream Property home"
          >
            <span className="text-[25px] font-black leading-none tracking-[-0.12em] lg:text-[32px]">
              odp
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-[13px] text-[#5f6368] lg:flex lg:text-[15px]"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className="relative py-2 transition-colors duration-200 hover:text-[#cf7544] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[#cf7544] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Koramangala%2C%20Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="group ml-auto inline-flex min-w-0 items-center justify-end gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-[#152b43] transition-all duration-200 hover:bg-white hover:text-[#cf7544] sm:text-xs lg:max-w-[230px]"
          >
            <MapPin
              aria-hidden="true"
              className="size-4 shrink-0 text-[#cf7544] transition-transform duration-200 group-hover:-translate-y-0.5"
            />
            <span className="truncate">Koramangala, Bengaluru</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          className={`fixed inset-x-0 bottom-0 top-[58px] z-50 flex origin-top flex-col overflow-y-auto border-t border-[#edd0bb] bg-white text-sm text-[#152b43] shadow-[0_18px_50px_rgba(21,43,67,0.18)] transition-[opacity,transform,visibility] duration-300 ease-out lg:hidden ${
            menuOpen
              ? "visible translate-y-0 scale-y-100 opacity-100"
              : "pointer-events-none invisible -translate-y-4 scale-y-95 opacity-0"
          }`}
        >
          <div className="divide-y divide-[#edd0bb]">
            {mobileItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="group flex min-h-[70px] items-center gap-4 px-6 text-base font-medium text-[#152b43] transition-all duration-200 hover:bg-[#fff1e7] hover:pl-7"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#cf7544] text-white transition-transform duration-200 group-hover:scale-105">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span>{item.label}</span>
                  <ArrowUpRight className="ml-auto size-4 text-[#cf7544] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {children}

      <footer
        id="contact"
        className="border-t border-[#cf7544] bg-[#f0a879] text-[#542d18]"
      >
        <div className="mx-auto grid max-w-[1280px] gap-9 px-5 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Link
              href="#top"
              className="inline-flex items-center text-[#cf7544]"
              aria-label="ODP home"
            >
              <span className="text-[32px] font-black leading-none tracking-[-0.12em]">
                odp
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#5f6368]">
              Thoughtfully selected homes for the way you want to live.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Discover
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]">
              <Link href="#properties">Buy Flats</Link>
              <Link href="#properties">Properties</Link>
              <Link href="#locations">Locations</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Company
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]">
              <Link href="#about">About Us</Link>
              <Link href="#contact">Contact</Link>
              <Link href="#contact">List Property</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Get in touch
            </h3>
            <p className="mt-5 text-sm leading-6 text-[#5f6368]">
              <a
                href="mailto:help.onestepdreamproperty@gmail.com"
                className="transition-colors hover:text-[#cf7544]"
              >
                help.onestepdreamproperty@gmail.com
              </a>
              <br />
              <a
                href="tel:+91 7411535782"
                className="transition-colors hover:text-[#cf7544]"
              >
                +91 7411535782
              </a>
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/30 px-5 py-6 text-xs text-white lg:text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 OneStep Dream Property. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>{" "}
        <div className="mx-auto mt-4 w-full max-w-[1280px] border-t border-white/20 px-5 pb-8 pt-6 sm:mt-6 sm:px-8 sm:pb-10 sm:pt-8">
          <p className="text-xs leading-6 text-white/80 sm:text-sm sm:leading-7">
            <strong className="font-semibold text-white">Disclaimer:</strong>{" "}
            ODP Services acts solely as an intermediary platform for advertising
            properties and is not a party to or responsible for transactions
            between buyers and sellers. All offers, discounts, and property
            details are subject to verification with the respective seller or
            developer.
          </p>
        </div>
      </footer>
    </div>
  );
}
