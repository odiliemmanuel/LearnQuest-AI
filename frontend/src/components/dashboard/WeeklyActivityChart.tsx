import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";

interface WeeklyActivityChartProps {
  data: { day: string; questions: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const totalQuestions = data.reduce((sum, d) => sum + d.questions, 0);

  return (
    <div className="rounded-3xl lq-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
        This week
      </p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: isDark ? "#1e293b" : "#f8fafc" }}
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: "none",
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
              }}
            />
            <Bar dataKey="questions" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        {totalQuestions} questions answered this week
      </p>
    </div>
  );
}
