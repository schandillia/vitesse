import { relations } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"
import { user } from "@/db/auth-schema"
import type { ProviderName } from "@/db/types/payment-provider"
import type { NormalizedSubscriptionStatus } from "@/db/types/subscription-status"
import type { TierKey } from "@/db/types/tier"

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider").$type<ProviderName>().notNull(),
    providerSubscriptionId: text("provider_subscription_id").notNull().unique(),
    planId: text("plan_id").notNull(),
    status: text("status").$type<NormalizedSubscriptionStatus>().notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    rawData: jsonb("raw_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
  ]
)

export const orders = pgTable(
  "orders",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    provider: text("provider").$type<ProviderName>().notNull(),
    providerOrderId: text("provider_order_id").notNull().unique(),
    providerPaymentId: text("provider_payment_id"),
    planId: text("plan_id").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull().default("pending"),
    rawData: jsonb("raw_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("orders_user_id_idx").on(table.userId)]
)

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").$type<ProviderName>().notNull(),
    providerEventId: text("provider_event_id").notNull(),
    eventType: text("event_type").notNull(),
    status: text("status").notNull().default("received"),
    error: text("error"),
    rawPayload: jsonb("raw_payload").notNull(),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
    processedAt: timestamp("processed_at"),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_unique").on(
      table.provider,
      table.providerEventId
    ),
    index("webhook_events_status_idx").on(table.status),
    index("webhook_events_received_at_idx").on(table.receivedAt),
  ]
)

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
}))

export const orderRelations = relations(orders, ({ one }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
}))
