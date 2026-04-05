import { useEffect, useState } from 'react';
import { fetchDashboard } from '../services/dashboardService';

function TypeTag({ type }) {
  const cls = type === 'INCOME' ? 'tag tag-income' : 'tag tag-expense';
  return <span className={cls}>{type}</span>;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchDashboard()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.response?.data?.message || e.message || 'Failed to load dashboard');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="alert-error">{error}</p>;
  }
  if (!data) {
    return <p className="loading-state">Loading</p>;
  }

  const { summary, recentTransactions, monthlySummary } = data;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total income</div>
          <div className="value">{Number(summary.totalIncome).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total expenses</div>
          <div className="value">{Number(summary.totalExpenses).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Net balance</div>
          <div className="value">{Number(summary.netBalance).toFixed(2)}</div>
        </div>
      </div>

      <h2 className="section-heading">Recent transactions</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th className="num">Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {recentTransactions.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>
                <TypeTag type={r.type} />
              </td>
              <td>{r.category}</td>
              <td className="num">{Number(r.amount).toFixed(2)}</td>
              <td>{r.description ? r.description : <span className="cell-empty">-</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-heading">Monthly summary</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th className="num">Income</th>
            <th className="num">Expenses</th>
            <th className="num">Net</th>
          </tr>
        </thead>
        <tbody>
          {monthlySummary.map((m) => (
            <tr key={m.yearMonth}>
              <td>{m.yearMonth}</td>
              <td className="num">{Number(m.income).toFixed(2)}</td>
              <td className="num">{Number(m.expenses).toFixed(2)}</td>
              <td className="num">{Number(m.net).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-heading">Category totals</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.categoryTotals.map((c, i) => (
            <tr key={i}>
              <td>{c.category}</td>
              <td>
                <TypeTag type={c.type} />
              </td>
              <td className="num">{Number(c.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
