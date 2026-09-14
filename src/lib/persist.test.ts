import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCheckIn,
  createSimulatedCase,
  escalateMissedDeadline,
  markDeadlineApproaching,
  verifyByCoordinator,
} from "./case-machine.ts";
import {
  parseDemoCase,
  resumePath,
  serializeDemoCase,
  shouldRedirectToLanding,
  stepFromPath,
} from "./persist.ts";

test("refresh restore keeps status, step, check-in, and verification flags", () => {
  const started = createSimulatedCase();
  const pending = applyCheckIn(started, {
    contactedClinic: "si",
    hasAppointment: "si",
    attended: "si",
  });

  const restored = parseDemoCase(serializeDemoCase(pending));
  assert.ok(restored);
  assert.equal(restored.status, "verification_pending");
  assert.equal(restored.currentStep, "verification");
  assert.equal(restored.checkIn.contactedClinic, "si");
  assert.equal(restored.checkIn.hasAppointment, "si");
  assert.equal(restored.checkIn.attended, "si");
  assert.equal(restored.patientReportedAttendance, true);
  assert.equal(restored.coordinatorVerified, false);
  assert.equal(restored.simulated, true);
  assert.equal(restored.persona.fictional, true);
});

test("legacy stored cases without currentStep resume a coherent route", () => {
  const raw = JSON.stringify({
    id: "sim-laura-cdmx-001",
    simulated: true,
    notADiagnosis: true,
    status: "escalated",
    checkIn: { contactedClinic: "no", hasAppointment: "no", attended: "no" },
  });
  const restored = parseDemoCase(raw);
  assert.ok(restored);
  assert.equal(restored.status, "escalated");
  assert.equal(restored.currentStep, "escalation");
  assert.equal(resumePath(restored), "/escalamiento");
});

test("verified handoff survives a storage round-trip", () => {
  const pending = applyCheckIn(createSimulatedCase(), {
    contactedClinic: "si",
    hasAppointment: "si",
    attended: "si",
  });
  const verified = verifyByCoordinator(pending);
  const restored = parseDemoCase(serializeDemoCase(verified));
  assert.ok(restored);
  assert.equal(restored.status, "verified");
  assert.equal(restored.coordinatorVerified, true);
  assert.equal(restored.currentStep, "verification");
});

test("deadline and escalation states survive a storage round-trip", () => {
  const approaching = markDeadlineApproaching(createSimulatedCase());
  const escalated = escalateMissedDeadline(approaching);
  const restored = parseDemoCase(serializeDemoCase(escalated));
  assert.ok(restored);
  assert.equal(restored.status, "escalated");
  assert.equal(restored.currentStep, "escalation");
});

test("do not redirect home until client storage has been read", () => {
  assert.equal(shouldRedirectToLanding(false, null), false);
  assert.equal(shouldRedirectToLanding(true, null), true);
  assert.equal(shouldRedirectToLanding(true, createSimulatedCase()), false);
});

test("empty or invalid storage is treated as no case, not a crash", () => {
  assert.equal(parseDemoCase(""), null);
  assert.equal(parseDemoCase("not-json"), null);
  assert.equal(parseDemoCase(JSON.stringify({ status: "verified" })), null);
});

test("workflow paths map back to persisted steps", () => {
  assert.equal(stepFromPath("/verificacion"), "verification");
  assert.equal(stepFromPath("/seguimiento"), "follow_up");
  assert.equal(stepFromPath("/unknown"), null);
});
