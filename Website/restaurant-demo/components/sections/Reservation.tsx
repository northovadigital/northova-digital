"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Clock, Phone, Users } from "lucide-react";
import Container from "@/components/common/Container";

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
}

function getTimeInMinutes(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export default function Reservation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minimumDate = getTodayDate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const date = String(formData.get("date") ?? "");
    const time = String(formData.get("time") ?? "");

    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const dateInput = form.elements.namedItem("date") as HTMLInputElement;
    const timeInput = form.elements.namedItem("time") as HTMLSelectElement;

    nameInput.setCustomValidity("");
    phoneInput.setCustomValidity("");
    dateInput.setCustomValidity("");
    timeInput.setCustomValidity("");

    if (name.length < 2) {
      nameInput.setCustomValidity(
        "Please enter a valid name containing at least 2 characters.",
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      phoneInput.setCustomValidity(
        "Please enter a valid phone number containing 7 to 15 digits.",
      );
    }

    if (date < minimumDate) {
      dateInput.setCustomValidity("Please select today or a future date.");
    }

    if (date === minimumDate && time) {
      const selectedTime = getTimeInMinutes(time);
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      if (selectedTime !== null && selectedTime <= currentTime) {
        timeInput.setCustomValidity("Please select a future reservation time.");
      }
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();
    setIsSubmitted(true);
  }

  return (
    <section
      id="reservation"
      className="scroll-mt-20 bg-[var(--primary)] py-20 md:py-28"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Reservations
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Reserve your table at Bella Vista.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-white/75">
              Plan your next family dinner, celebration or romantic evening with
              authentic Italian food and warm hospitality.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <CalendarDays className="mt-1 text-[var(--accent)]" size={24} />
                <div>
                  <p className="font-semibold">Open Daily</p>
                  <p className="mt-1 text-sm text-white/70">Monday to Sunday</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 text-[var(--accent)]" size={24} />
                <div>
                  <p className="font-semibold">Dining Hours</p>
                  <p className="mt-1 text-sm text-white/70">
                    11:00 AM – 10:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-[var(--accent)]" size={24} />
                <div>
                  <p className="font-semibold">Call Us</p>
                  <a
                    href="tel:+17135550198"
                    className="mt-1 block text-sm text-white/70 hover:text-white"
                  >
                    (713) 555-0198
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="mt-1 text-[var(--accent)]" size={24} />
                <div>
                  <p className="font-semibold">Group Dining</p>
                  <p className="mt-1 text-sm text-white/70">
                    Parties of up to 12 guests
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-xl sm:p-8"
          >
            <h3 className="text-2xl font-bold text-[var(--primary)]">
              Book a Table
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)]">
              All fields are required.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-[var(--primary)]">
                Full Name
                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  maxLength={60}
                  autoComplete="name"
                  placeholder="Your full name"
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>

              <label className="text-sm font-medium text-[var(--primary)]">
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  minLength={7}
                  maxLength={22}
                  pattern="[0-9+() -]{7,22}"
                  title="Enter a valid phone number using numbers, spaces, brackets, + or -."
                  placeholder="(713) 555-0000"
                  onInput={(event) => {
                    event.currentTarget.value =
                      event.currentTarget.value.replace(/[^0-9+() -]/g, "");

                    event.currentTarget.setCustomValidity("");
                  }}
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>

              <label className="text-sm font-medium text-[var(--primary)]">
                Date
                <input
                  type="date"
                  name="date"
                  required
                  min={minimumDate}
                  onChange={(event) =>
                    event.currentTarget.setCustomValidity("")
                  }
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[var(--accent)]"
                />
              </label>

              <label className="text-sm font-medium text-[var(--primary)]">
                Time
                <select
                  name="time"
                  required
                  defaultValue=""
                  onChange={(event) =>
                    event.currentTarget.setCustomValidity("")
                  }
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[var(--accent)]"
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                </select>
              </label>

              <label className="text-sm font-medium text-[var(--primary)] sm:col-span-2">
                Number of Guests
                <select
                  name="guests"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[var(--accent)]"
                >
                  <option value="" disabled>
                    Select guests
                  </option>

                  {Array.from({ length: 12 }, (_, index) => {
                    const guests = index + 1;

                    return (
                      <option key={guests} value={guests}>
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[var(--accent)] px-6 py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              Request Reservation
            </button>

            {isSubmitted && (
              <p
                className="mt-5 rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-800"
                aria-live="polite"
              >
                Reservation request submitted successfully. Our team will
                contact you shortly.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
