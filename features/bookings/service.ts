import { randomBytes } from "crypto";
import { BookingStatus, HouseStatus, Prisma } from "@prisma/client";
import type { Session } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { parseDateOnly, rangesOverlap } from "@/lib/utils/dates";
import { calculateStayTotalAmd } from "@/lib/utils/pricing";
import {
  sendBookingCancelledEmail,