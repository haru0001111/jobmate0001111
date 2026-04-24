'use client';

import { useEffect, useMemo, useState } from 'react';
import CompanyList from '@/components/CompanyList';
import EventList from '@/components/EventList';
import KpiCard from '@/components/KpiCard';
import { UserMenu } from '@/components/auth/UserMenu';
import TaskList from '@/components/TaskList';
import { getAuthHeaders } from '@/lib/auth/client-auth-fetch';
import type { Company, JobEvent, JobTask } from '@/types';

type DashboardPayload<T> = { items?: T[] };

export default function DashboardClient({
  initialCompanies,
  initialEvents,
  initialTasks,
}: {
  initialCompanies: Company[];
  initialEvents: JobEvent[];
  initialTasks: JobTask[];
}) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [events, setEvents] = useState<JobEvent[]>(initialEvents);
  const [tasks, setTasks] = useState<JobTask[]>(initialTasks);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const headers = await getAuthHeaders();
        const [companyResponse, eventResponse, taskResponse] = await Promise.all([
          fetch('/api/companies', { cache: 'no-store', headers }),
          fetch('/api/events?onlyUpcoming=true', { cache: 'no-store', headers }),
          fetch('/api/tasks?onlyOpen=true', { cache: 'no-store', headers }),
        ]);

        if (!companyResponse.ok || !eventResponse.ok || !taskResponse.ok) return;

        const [companyData, eventData, taskData] = await Promise.all([
          companyResponse.json() as Promise<DashboardPayload<Company>>,
          eventResponse.json() as Promise<DashboardPayload<JobEvent>>,
          taskResponse.json() as Promise<DashboardPayload<JobTask>>,
        ]);

        if (!ignore) {
          if (Array.isArray(companyData.items)) setCompanies(companyData.items);
          if (Array.isArray(eventData.items)) setEvents(eventData.items);
          if (Array.isArray(taskData.items)) setTasks(taskData.items);
        }
      } catch {
        // keep server-rendered seed data
      }
    }

    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const upcoming = useMemo(
    () => events.filter((e) => new Date(e.startAt).getTime() > Date.now()).sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [events],
  );
  const activeTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

  return (
    <main className="container">
      <div className="header">
        <div>
          <span className="badge">ダッシュボード</span>
          <h1>就活状況の一覧</h1>
        </div>
        <UserMenu />
      </div>

      <section className="grid grid-3" style={{ marginBottom: 24 }}>
        <KpiCard label="登録企業" value={companies.length} sublabel="無料版は3社まで" />
        <KpiCard label="今後の予定" value={upcoming.length} sublabel="説明会・面接・締切" />
        <KpiCard label="未完了タスク" value={activeTasks.length} sublabel="今日やることに集中" />
      </section>

      <section className="grid" style={{ gridTemplateColumns: '1.1fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="header"><h2>今後の予定</h2><span className="badge">重要順</span></div>
          <EventList items={upcoming} />
        </div>
        <div className="grid">
          <div className="card">
            <div className="header"><h2>企業一覧</h2><span className="badge">進捗管理</span></div>
            <CompanyList items={companies} />
          </div>
          <div className="card">
            <div className="header"><h2>やること</h2><span className="badge">直近対応</span></div>
            <TaskList items={activeTasks} />
          </div>
        </div>
      </section>
    </main>
  );
}
