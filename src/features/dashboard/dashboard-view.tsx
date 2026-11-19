"use client";

import { Activity, Stethoscope, UserPlus, UsersRound, type LucideIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChartCard } from "@/components/charts/chart-card";
import { KpiCard } from "@/components/charts/kpi-card";
import { StackedShareBar } from "@/components/charts/stacked-share-bar";
import { DateRangeFilter } from "@/components/data-table/date-range-filter";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GENDER_LABELS, STATUS_META, type Gender, type PatientStatus } from "@/constants/domain";
import { toSearchParams } from "@/lib/api-client";
import { formatDate, formatNumber, utcDay } from "@/lib/format";
import { barListHeight } from "@/components/charts/chart-sizes";
import {
  useDashboardDistribution,
  useDashboardSummary,
  useDashboardTrends,
  useTopDoctors,
} from "./hooks";
import { GRANULARITIES, useDashboardFilters } from "./search-params";

// Recharts is heavy: load it in a separate chunk, client-only.
function TrendChartFallback() {
  return <Skeleton className="h-[280px] w-full rounded-lg" />;
}
function BarChartFallback() {
  return <Skeleton className="h-[320px] w-full rounded-lg" />;
}
const TrendChart = dynamic(
  () => import("@/components/charts/trend-chart").then((m) => m.TrendChart),
  { ssr: false, loading: TrendChartFallback },
);
const BarListChart = dynamic(
  () => import("@/components/charts/bar-list-chart").then((m) => m.BarListChart),
  { ssr: false, loading: BarChartFallback },
);

const TREND_HEIGHT = 280;

const STATUS_COLORS: Record<PatientStatus, string> = {
  admitted: "var(--chart-admitted)",
  under_treatment: "var(--chart-under-treatment)",
  recovered: "var(--chart-recovered)",
  discharged: "var(--chart-discharged)",
};
const GENDER_COLORS: Record<Gender, string> = {
  male: "var(--chart-cat-1)",
  female: "var(--chart-cat-2)",
  other: "var(--chart-cat-3)",
};
// Status bar keeps the patient-journey order (not sorted by size) so segments never jump around.
const STATUS_ORDER: PatientStatus[] = ["admitted", "under_treatment", "recovered", "discharged"];

export function DashboardView() {
  const router = useRouter();
  const { filters, range, setFilters, isDefaultRange } = useDashboardFilters();

  const summary = useDashboardSummary(range);
  const trends = useDashboardTrends(range, filters.granularity);
  const topDoctors = useTopDoctors(range);
  const distribution = useDashboardDistribution(range);

  const effectiveRange = summary.data?.range;
  const rangeText = isDefaultRange
    ? "the last 30 days"
    : effectiveRange
      ? `${formatDate(utcDay(effectiveRange.from))} – ${formatDate(utcDay(effectiveRange.to))}`
      : "the selected period";

  /** Drill-down links carry the same range, so the list matches the chart. */
  const drill = (path: string, params: Record<string, string>) =>
    router.push(`${path}${toSearchParams({ ...params, from: range.from, to: range.to })}`);

  const kpis: Array<{
    label: string;
    icon: LucideIcon;
    value: number | undefined;
    changePct?: number | null;
    footnote?: string;
  }> = [
    {
      label: "Total patients",
      icon: UsersRound,
      value: summary.data?.totalPatients,
      footnote: "All time",
    },
    {
      label: "New patients",
      icon: UserPlus,
      value: summary.data?.newPatients.current,
      changePct: summary.data?.newPatients.changePct,
      footnote: "vs previous period",
    },
    {
      label: "Active patients",
      icon: Activity,
      value: summary.data?.activePatients,
      footnote: "Admitted or under treatment",
    },
    {
      label: "Doctors",
      icon: Stethoscope,
      value: summary.data?.totalDoctors,
      footnote: summary.data
        ? `${formatNumber(summary.data.newDoctors.current)} joined in period`
        : undefined,
    },
    {
      label: "Avg patients per doctor",
      icon: UsersRound,
      value: summary.data?.avgPatientsPerDoctor,
      footnote: "All time",
    },
  ];

  const conditionData = (distribution.data?.byCondition ?? []).map(({ key, count }) => ({
    key,
    label: key,
    value: count,
  }));
  const specializationData = (distribution.data?.bySpecialization ?? []).map(({ key, count }) => ({
    key,
    label: key,
    value: count,
  }));
  const topDoctorData = (topDoctors.data ?? []).map((doctor) => ({
    key: doctor.doctorId,
    label: `Dr. ${doctor.name}`,
    value: doctor.count,
  }));
  const statusSegments = STATUS_ORDER.map((status) => ({
    key: status,
    label: STATUS_META[status].label,
    value: distribution.data?.byStatus.find((s) => s.key === status)?.count ?? 0,
    color: STATUS_COLORS[status],
  }));
  const genderSegments = (["male", "female", "other"] as const).map((gender) => ({
    key: gender,
    label: GENDER_LABELS[gender],
    value: distribution.data?.byGender.find((g) => g.key === gender)?.count ?? 0,
    color: GENDER_COLORS[gender],
  }));
  const patientsInRange = statusSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <>
      <PageHeader title="Dashboard" description={`Patient intake and workload for ${rangeText}.`} />

      {/* One filter row above everything it scopes. */}
      <div className="flex flex-wrap items-center gap-2">
        <DateRangeFilter
          title="Period"
          value={range}
          onChange={({ from, to }) => setFilters({ from, to })}
        />
        {isDefaultRange && (
          <span className="text-muted-foreground text-sm">Showing last 30 days</span>
        )}
      </div>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
      >
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} isLoading={summary.isPending} />
        ))}
      </section>

      <ChartCard
        title="New patients over time"
        description={
          trends.data
            ? `Admissions per ${trends.data.granularity} · latest ${trends.data.granularity} still in progress`
            : "Admissions over time"
        }
        isLoading={trends.isPending}
        isFetching={trends.isPlaceholderData}
        error={trends.error}
        onRetry={() => trends.refetch()}
        isEmpty={trends.data?.points.every((p) => p.count === 0)}
        height={TREND_HEIGHT}
        actions={
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={trends.data?.granularity ?? ""}
            onValueChange={(value) =>
              value && setFilters({ granularity: value as (typeof GRANULARITIES)[number] })
            }
            aria-label="Granularity"
            className="hidden sm:flex"
          >
            {GRANULARITIES.map((g) => (
              <ToggleGroupItem key={g} value={g} className="px-2.5 capitalize">
                {g}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
        table={
          trends.data && {
            columns: ["Period starting", "New patients"],
            align: ["left", "right"],
            rows: trends.data.points.map((p) => [
              formatDate(utcDay(p.date)),
              formatNumber(p.count),
            ]),
          }
        }
      >
        {trends.data && (
          <TrendChart
            points={trends.data.points}
            granularity={trends.data.granularity}
            height={TREND_HEIGHT}
          />
        )}
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-5">
        <ChartCard
          className="lg:col-span-3"
          title="Busiest doctors"
          description="Top 10 by new patients in the period · click a bar to open"
          isLoading={topDoctors.isPending}
          isFetching={topDoctors.isPlaceholderData}
          error={topDoctors.error}
          onRetry={() => topDoctors.refetch()}
          isEmpty={topDoctorData.length === 0}
          height={barListHeight(10)}
          table={
            topDoctors.data && {
              columns: ["Doctor", "Specialization", "Patients"],
              align: ["left", "left", "right"],
              rows: topDoctors.data.map((d) => [
                `Dr. ${d.name}`,
                d.specialization,
                formatNumber(d.count),
              ]),
            }
          }
        >
          <BarListChart
            data={topDoctorData}
            valueLabel="Patients"
            labelWidth={170}
            maxLabelChars={22}
            onSelect={(d) => router.push(`/doctors/${d.key}`)}
          />
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Patient mix"
          description={`${formatNumber(patientsInRange)} patients admitted in the period`}
          isLoading={distribution.isPending}
          isFetching={distribution.isPlaceholderData}
          error={distribution.error}
          onRetry={() => distribution.refetch()}
          isEmpty={patientsInRange === 0}
          height={barListHeight(10)}
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">By status</h3>
              <StackedShareBar segments={statusSegments} label="Patients by status" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">By gender</h3>
              <StackedShareBar segments={genderSegments} label="Patients by gender" />
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Conditions"
          description="New patients by condition · click to see patients"
          isLoading={distribution.isPending}
          isFetching={distribution.isPlaceholderData}
          error={distribution.error}
          onRetry={() => distribution.refetch()}
          isEmpty={patientsInRange === 0}
          height={barListHeight(12)}
          table={{
            columns: ["Condition", "Patients"],
            align: ["left", "right"],
            rows: conditionData.map((d) => [d.label, formatNumber(d.value)]),
          }}
        >
          <BarListChart
            data={conditionData}
            valueLabel="Patients"
            onSelect={(d) => drill("/patients", { condition: d.key })}
          />
        </ChartCard>

        <ChartCard
          title="Doctors by specialization"
          description="Whole team · click to see doctors"
          isLoading={distribution.isPending}
          isFetching={distribution.isPlaceholderData}
          error={distribution.error}
          onRetry={() => distribution.refetch()}
          isEmpty={specializationData.every((d) => d.value === 0)}
          height={barListHeight(12)}
          table={{
            columns: ["Specialization", "Doctors"],
            align: ["left", "right"],
            rows: specializationData.map((d) => [d.label, formatNumber(d.value)]),
          }}
        >
          <BarListChart
            data={specializationData}
            valueLabel="Doctors"
            onSelect={(d) => router.push(`/doctors${toSearchParams({ specialization: d.key })}`)}
          />
        </ChartCard>
      </div>
    </>
  );
}
