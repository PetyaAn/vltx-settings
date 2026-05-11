import { useMemo, useRef, useState, type CSSProperties } from 'react';

type ChartTab = 'sales' | 'profit' | 'orders' | 'stock' | 'cash';
type Season = 'Пик' | 'Рост' | 'Спад';
type SeasonFilter = 'Все' | Season;
type SortKey = 'week' | 'seasonRatio' | 'speed7d' | 'margin' | 'ordersRub';

type PlanRow = {
  start: string;
  end: string;
  week: number;
  month: string;
  season: Season;
  strategy: string;
  seasonRatio: number;
  manualRatio: number | null;
  speed7d: number;
  priceRatio: number;
  demandRatio: number;
  totalRatio: number;
  sppPrice: number;
  spp: number;
  priceBeforeSpp: number;
  margin: number;
  promotion: number;
  ordersQty: number;
  ordersRub: number;
};

type ChartPoint = {
  label: string;
  orders: number;
  stock: number;
  profit: number;
  cash: number;
};

const chartTabs: Record<ChartTab, string> = {
  sales: 'Прогноз продаж',
  profit: 'Прибыль',
  orders: 'Заказы',
  stock: 'Остатки',
  cash: 'Касса',
};

const chartPoints: ChartPoint[] = [
  { label: '01.09', orders: 693, stock: 7600, profit: 19.4, cash: 1.52 },
  { label: '01.10', orders: 730, stock: 4300, profit: 21.2, cash: 1.58 },
  { label: '01.11', orders: 823, stock: 1700, profit: 26.8, cash: 1.8 },
  { label: '01.12', orders: 1028, stock: 5600, profit: 29.6, cash: 2.23 },
  { label: '01.01', orders: 1233, stock: 2100, profit: 31.4, cash: 2.68 },
  { label: '01.02', orders: 986, stock: 8200, profit: 27.5, cash: 2.14 },
  { label: '01.03', orders: 1286, stock: 2700, profit: 32.2, cash: 2.79 },
  { label: '01.04', orders: 1321, stock: 7100, profit: 33.8, cash: 2.86 },
  { label: '01.05', orders: 825, stock: 2900, profit: 24.1, cash: 1.79 },
  { label: '01.06', orders: 1198, stock: 6500, profit: 30.1, cash: 2.6 },
  { label: '01.07', orders: 1021, stock: 3000, profit: 28.7, cash: 2.21 },
  { label: '01.08', orders: 1273, stock: 7350, profit: 33.1, cash: 2.76 },
];

const planRows: PlanRow[] = [
  row('03.08.25', '09.08.25', 1, 'авг.', 'Пик', 'Старт продаж', 112.74, null, 875, 96, 137, 149, 1740, 17.34, 2105, 25.72, 100, 875, 1841860),
  row('10.08.25', '16.08.25', 2, 'авг.', 'Спад', 'Снять перегрев', 88.66, null, 693, 100, 130, 115, 1810, 17.34, 2190, 27.16, 100, 693, 1517329),
  row('17.08.25', '23.08.25', 3, 'авг.', 'Рост', 'Вернуть темп', 89, 89, 700, 100, 89, 52, 1790, 17.34, 2165, 26.76, 100, 700, 1516868),
  row('24.08.25', '30.08.25', 4, 'авг.', 'Рост', 'Стабилизация', 89, 89, 705, 99, 59, 22, 1800, 17.34, 2178, 26.96, 100, 705, 1535909),
  row('31.08.25', '06.09.25', 5, 'авг.', 'Рост', 'Поддержка', 89, 89, 710, 100, 25, 4, 1810, 17.34, 2190, 27.16, 100, 710, 1555067),
  row('07.09.25', '13.09.25', 6, 'сент.', 'Рост', 'Поддержка', 89, 89, 715, 100, 14, 1, 1820, 17.34, 2202, 27.36, 100, 715, 1574342),
  row('14.09.25', '20.09.25', 7, 'сент.', 'Рост', 'Поддержка', 89, 89, 720, 100, 15, 2, 1800, 17.34, 2178, 26.96, 100, 720, 1567608),
  row('21.09.25', '27.09.25', 8, 'сент.', 'Рост', 'Поддержка', 89, 89, 725, 100, 22, 4, 1790, 17.34, 2165, 26.76, 100, 725, 1569407),
  row('28.09.25', '04.10.25', 9, 'сент.', 'Рост', 'Усилить спрос', 89, 89, 730, 99, 32, 8, 1790, 17.34, 2165, 26.76, 100, 730, 1579914),
  row('05.10.25', '11.10.25', 10, 'окт.', 'Рост', 'Усилить спрос', 89, 89, 734, 99, 60, 31, 1830, 17.34, 2214, 27.56, 100, 734, 1625962),
  row('12.10.25', '18.10.25', 11, 'окт.', 'Рост', 'Удержание', 89, 89, 739, 101, 62, 45, 1860, 17.34, 2250, 28.13, 100, 739, 1663536),
  row('19.10.25', '25.10.25', 12, 'окт.', 'Рост', 'Проверка цены', 98.38, null, 823, 103, 81, 82, 1810, 17.34, 2190, 27.16, 100, 823, 1801099),
  row('26.10.25', '01.11.25', 13, 'окт.', 'Спад', 'Контроль остатков', 89.47, null, 753, 100, 75, 67, 1830, 17.34, 2214, 27.56, 100, 753, 1666988),
  row('02.11.25', '08.11.25', 14, 'нояб.', 'Рост', 'Плавный рост', 91.2, 90, 793, 101, 86, 74, 1840, 17.34, 2226, 27.75, 100, 793, 1765518),
  row('09.11.25', '15.11.25', 15, 'нояб.', 'Пик', 'Пик спроса', 117.4, null, 1028, 104, 126, 134, 1870, 17.34, 2262, 28.31, 100, 1028, 2325336),
  row('16.11.25', '22.11.25', 16, 'нояб.', 'Рост', 'Сдержать ДРР', 96.8, 94, 896, 102, 92, 83, 1850, 17.34, 2238, 27.94, 100, 896, 2005248),
];

const metrics = [
  { label: 'Рост рынка', value: 'Умеренный', tone: 'good', hint: '+12,7% к базовому спросу' },
  { label: 'Раскрутка', value: '0 нед.', tone: 'muted', hint: 'Без дополнительного разгона' },
  { label: 'Округлять до', value: '100', tone: 'muted', hint: 'Шаг закупки' },
  { label: 'Макс. оборач.', value: '40', tone: 'muted', hint: 'Дней остатка' },
  { label: 'ROI на инвестиции', value: '368%', tone: 'good', hint: 'Целевой сценарий' },
  { label: 'ROI на поставки', value: '72%', tone: 'warn', hint: 'Зона внимания' },
  { label: 'GMROI', value: '695%', tone: 'good', hint: 'Эффективность товара' },
  { label: 'Прибыль за год', value: '20 720 252 ₽', tone: 'good', hint: 'После ДРР' },
];

function row(
  start: string,
  end: string,
  week: number,
  month: string,
  season: Season,
  strategy: string,
  seasonRatio: number,
  manualRatio: number | null,
  speed7d: number,
  priceRatio: number,
  demandRatio: number,
  totalRatio: number,
  sppPrice: number,
  spp: number,
  priceBeforeSpp: number,
  margin: number,
  promotion: number,
  ordersQty: number,
  ordersRub: number,
): PlanRow {
  return {
    start,
    end,
    week,
    month,
    season,
    strategy,
    seasonRatio,
    manualRatio,
    speed7d,
    priceRatio,
    demandRatio,
    totalRatio,
    sppPrice,
    spp,
    priceBeforeSpp,
    margin,
    promotion,
    ordersQty,
    ordersRub,
  };
}

function App() {
  const [activeTab, setActiveTab] = useState<ChartTab>('sales');
  const [season, setSeason] = useState<SeasonFilter>('Все');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'week', direction: 'asc' });
  const [fileName, setFileName] = useState('analytics_wb_ozon.xlsx');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...planRows]
      .filter((item) => season === 'Все' || item.season === season)
      .filter((item) =>
        normalized
          ? `${item.start} ${item.end} ${item.month} ${item.season} ${item.strategy}`.toLowerCase().includes(normalized)
          : true,
      )
      .sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        const result = Number(aValue) - Number(bValue);
        return sort.direction === 'asc' ? result : -result;
      });
  }, [query, season, sort]);

  const totalOrders = filteredRows.reduce((sum, item) => sum + item.ordersQty, 0);
  const totalRevenue = filteredRows.reduce((sum, item) => sum + item.ordersRub, 0);
  const averageMargin = filteredRows.reduce((sum, item) => sum + item.margin, 0) / Math.max(filteredRows.length, 1);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' },
    );
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    showToast('Файл загружен, период обновлен');
  };

  return (
    <main className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} />
      <section className="workspace" aria-label="План года для товара 12372890">
        <header className="topbar">
          <div>
            <p className="eyebrow">Аналитика рынка</p>
            <h1>План года</h1>
          </div>
          <div className="topbar-actions">
            <div className="period-pill">
              <Icon name="calendar" />
              <span>с 01.08.24 по 02.08.25</span>
            </div>
            <button className="button secondary" type="button" onClick={() => inputRef.current?.click()}>
              <Icon name="upload" />
              Загрузить файл
            </button>
            <input
              ref={inputRef}
              className="visually-hidden"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <button className="button primary" type="button" onClick={() => showToast('Расчет выполнен: план пересобран')}>
              <Icon name="refresh" />
              Расчет
            </button>
          </div>
        </header>

        <div className="dashboard-grid">
          <ProductCard fileName={fileName} />
          <MetricPanel />
          <ChartPanel activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <section className="table-section" aria-labelledby="grid-title">
          <div className="table-toolbar">
            <div>
              <p className="eyebrow">Data grid</p>
              <h2 id="grid-title">Недельный план продаж</h2>
            </div>
            <div className="table-controls">
              <label className="search-field">
                <Icon name="search" />
                <input
                  type="search"
                  placeholder="Поиск по периоду, месяцу, стратегии"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="segmented" aria-label="Фильтр сезона">
                {(['Все', 'Пик', 'Рост', 'Спад'] as SeasonFilter[]).map((item) => (
                  <button
                    key={item}
                    className={season === item ? 'active' : ''}
                    type="button"
                    onClick={() => setSeason(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="summary-strip">
            <Summary label="Строк" value={String(filteredRows.length)} />
            <Summary label="Заказы" value={formatNumber(totalOrders)} />
            <Summary label="Выручка" value={formatMoney(totalRevenue)} />
            <Summary label="Средняя маржа" value={`${formatPercent(averageMargin)}`} />
          </div>
          <DataGrid rows={filteredRows} sort={sort} onSort={toggleSort} />
        </section>
      </section>
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className="sidebar" data-collapsed={collapsed}>
      <div className="sidebar-head">
        <div className="logo" aria-label="Логотип">
          <span>PA</span>
        </div>
        <button
          className="collapse-button"
          type="button"
          aria-label={collapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
          aria-pressed={collapsed}
          onClick={onToggle}
        >
          <Icon name={collapsed ? 'panelOpen' : 'panelClose'} />
        </button>
      </div>
      <nav className="nav-list" aria-label="Основная навигация">
        <NavItem icon="home" label="Главная" />
        <NavItem icon="plan" label="План года" active />
        <NavItem icon="dashboard" label="Дашборд" />
      </nav>
      <div className="sidebar-card">
        <span>WB + Ozon</span>
        <strong>Seller analytics</strong>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: IconName; label: string; active?: boolean }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} type="button">
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}

function ProductCard({ fileName }: { fileName: string }) {
  return (
    <section className="panel product-card" aria-labelledby="product-title">
      <div className="product-photo" aria-label="Фотография товара">
        <div className="package-visual">
          <span>WB</span>
          <b>x_type_z3</b>
        </div>
      </div>
      <div className="product-meta">
        <span className="status-dot">Склейка активна</span>
        <h2 id="product-title">12372890 - x_type_z3</h2>
        <p>Артикул 109827300</p>
      </div>
      <div className="product-stats">
        <span>
          <b>27,43%</b>
          Маржа до ДРР
        </span>
        <span>
          <b>53 563</b>
          Заказы, шт.
        </span>
      </div>
      <div className="file-note">
        <Icon name="file" />
        <span>{fileName}</span>
      </div>
    </section>
  );
}

function MetricPanel() {
  return (
    <section className="panel metrics-panel" aria-labelledby="metrics-title">
      <div className="panel-heading">
        <p className="eyebrow">Параметры расчета</p>
        <h2 id="metrics-title">Метрики</h2>
      </div>
      <div className="metric-list">
        {metrics.map((metric) => (
          <article className={`metric-card ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.hint}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChartPanel({ activeTab, onTabChange }: { activeTab: ChartTab; onTabChange: (tab: ChartTab) => void }) {
  const chartTitle = chartTabs[activeTab];
  const primaryLabel = activeTab === 'sales' ? 'Прогноз Заказов' : chartTitle;
  const secondaryLabel = activeTab === 'sales' ? 'Прогноз Остаток' : 'Остатки';

  return (
    <section className="panel chart-panel" aria-labelledby="chart-title">
      <div className="chart-header">
        <div>
          <p className="eyebrow">Прогноз</p>
          <h2 id="chart-title">{chartTitle}</h2>
        </div>
        <div className="chart-tabs" aria-label="Показатель графика">
          {(Object.keys(chartTabs) as ChartTab[]).map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              type="button"
              onClick={() => onTabChange(tab)}
            >
              {chartTabs[tab]}
            </button>
          ))}
        </div>
      </div>
      <div className="legend">
        <span className="orders">{primaryLabel}</span>
        <span className="stock">{secondaryLabel}</span>
      </div>
      <ForecastChart activeTab={activeTab} />
    </section>
  );
}

function ForecastChart({ activeTab }: { activeTab: ChartTab }) {
  const width = 820;
  const height = 300;
  const padding = { top: 20, right: 42, bottom: 38, left: 44 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const primaryKey = activeTab === 'profit' ? 'profit' : activeTab === 'cash' ? 'cash' : 'orders';
  const primaryValues = chartPoints.map((point) => point[primaryKey]);
  const secondaryValues = chartPoints.map((point) => point.stock);
  const primaryRange = [Math.min(...primaryValues) * 0.86, Math.max(...primaryValues) * 1.08];
  const stockRange = [0, 10000];

  const x = (index: number) => padding.left + (index / (chartPoints.length - 1)) * innerWidth;
  const y = (value: number, range: number[]) =>
    padding.top + innerHeight - ((value - range[0]) / (range[1] - range[0])) * innerHeight;
  const primaryPath = linePath(primaryValues.map((value, index) => [x(index), y(value, primaryRange)]));
  const stockPath = linePath(secondaryValues.map((value, index) => [x(index), y(value, stockRange)]));
  const areaPath = `${stockPath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${
    padding.top + innerHeight
  } Z`;

  return (
    <svg className="forecast-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Линейный график прогноза">
      {[0, 1, 2, 3, 4].map((line) => {
        const yy = padding.top + (line / 4) * innerHeight;
        return <path className="grid-line" d={`M ${padding.left} ${yy} H ${padding.left + innerWidth}`} key={line} />;
      })}
      {chartPoints.map((point, index) => (
        <g key={point.label}>
          <path className="grid-line vertical" d={`M ${x(index)} ${padding.top} V ${padding.top + innerHeight}`} />
          <text className="axis-label" x={x(index)} y={height - 10} textAnchor="middle">
            {point.label}
          </text>
        </g>
      ))}
      <path className="stock-area" d={areaPath} />
      <path className="line stock-line" d={stockPath} />
      <path className="line orders-line" d={primaryPath} />
      {chartPoints.map((point, index) => (
        <g key={`${point.label}-dot`}>
          <circle className="orders-dot" cx={x(index)} cy={y(point[primaryKey], primaryRange)} r="4" />
          <text className="point-label" x={x(index)} y={y(point[primaryKey], primaryRange) - 10} textAnchor="middle">
            {formatCompact(point[primaryKey])}
          </text>
        </g>
      ))}
      <text className="axis-caption" x="6" y={padding.top + 8}>
        Кол-во
      </text>
      <text className="axis-caption stock-caption" x={width - 36} y={padding.top + 8}>
        Остаток
      </text>
    </svg>
  );
}

function DataGrid({
  rows,
  sort,
  onSort,
}: {
  rows: PlanRow[];
  sort: { key: SortKey; direction: 'asc' | 'desc' };
  onSort: (key: SortKey) => void;
}) {
  return (
    <div className="data-grid-wrap">
      <table className="data-grid">
        <colgroup>
          <col className="col-period" />
          <col className="col-week" />
          <col className="col-month" />
          <col className="col-season" />
          <col className="col-strategy" />
          <col span={6} className="col-ratio" />
          <col className="col-money" />
          <col className="col-small" />
          <col className="col-money" />
          <col className="col-ratio" />
          <col className="col-ratio" />
          <col className="col-orders" />
          <col className="col-money" />
        </colgroup>
        <thead>
          <tr>
            <th className="sticky-col">
              Период
            </th>
            <SortableTh label="Нед." sortKey="week" sort={sort} onSort={onSort} />
            <th>Месяц</th>
            <th>Сезон</th>
            <th>Стратегия</th>
            <SortableTh label="Сезон, к." sortKey="seasonRatio" sort={sort} onSort={onSort} />
            <th>Ручн., к.</th>
            <SortableTh label="Скор. 7Д" sortKey="speed7d" sort={sort} onSort={onSort} />
            <th>Цена, к.</th>
            <th>Спрос</th>
            <th>Итог</th>
            <th>Цена СПП</th>
            <th>СПП</th>
            <th>До СПП</th>
            <SortableTh label="Маржа" sortKey="margin" sort={sort} onSort={onSort} />
            <th>Раскр.</th>
            <th>Шт.</th>
            <SortableTh label="Руб." sortKey="ordersRub" sort={sort} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={`${item.start}-${item.week}`}>
              <td className="sticky-col period-cell">
                <span>{item.start}</span>
                <span>{item.end}</span>
              </td>
              <td>{item.week}</td>
              <td>{item.month}</td>
              <td>
                <span className={`season-badge ${seasonClass(item.season)}`}>{item.season}</span>
              </td>
              <td className="strategy">{item.strategy}</td>
              <HeatCell value={item.seasonRatio} min={80} max={120} suffix="%" />
              <td>{item.manualRatio ? `${formatPercent(item.manualRatio)}` : '—'}</td>
              <HeatCell value={item.speed7d} min={650} max={1050} />
              <HeatCell value={item.priceRatio} min={95} max={105} suffix="%" />
              <HeatCell value={item.demandRatio} min={0} max={140} suffix="%" />
              <HeatCell value={item.totalRatio} min={0} max={150} suffix="%" />
              <td>{formatMoney(item.sppPrice)}</td>
              <td>{formatPercent(item.spp)}</td>
              <td>{formatMoney(item.priceBeforeSpp)}</td>
              <HeatCell value={item.margin} min={24} max={30} suffix="%" />
              <td>{formatPercent(item.promotion)}</td>
              <td>{formatNumber(item.ordersQty)}</td>
              <td className="money">{formatMoney(item.ordersRub)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortableTh({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; direction: 'asc' | 'desc' };
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  return (
    <th>
      <button className={`sort-button ${active ? 'active' : ''}`} type="button" onClick={() => onSort(sortKey)}>
        {label}
        <span>{active && sort.direction === 'asc' ? '↑' : '↓'}</span>
      </button>
    </th>
  );
}

function HeatCell({ value, min, max, suffix = '' }: { value: number; min: number; max: number; suffix?: string }) {
  const heat = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return (
    <td>
      <span className="heat-cell" style={{ backgroundColor: heatColor(heat) } as CSSProperties}>
        {suffix === '%' ? formatPercent(value) : formatNumber(value)}
      </span>
    </td>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <b>{value}</b>
      {label}
    </span>
  );
}

type IconName =
  | 'calendar'
  | 'dashboard'
  | 'file'
  | 'home'
  | 'panelClose'
  | 'panelOpen'
  | 'plan'
  | 'refresh'
  | 'search'
  | 'upload';

function Icon({ name }: { name: IconName }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
  const pathProps = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  switch (name) {
    case 'calendar':
      return (
        <svg {...common}>
          <path {...pathProps} d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg {...common}>
          <path {...pathProps} d="M4 13h6V4H4v9ZM14 20h6V4h-6v16ZM4 20h6v-3H4v3Z" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path {...pathProps} d="M6 3h8l4 4v14H6V3Z" />
          <path {...pathProps} d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case 'home':
      return (
        <svg {...common}>
          <path {...pathProps} d="m4 11 8-7 8 7v9h-5v-6H9v6H4v-9Z" />
        </svg>
      );
    case 'panelClose':
      return (
        <svg {...common}>
          <path {...pathProps} d="M4 5h16v14H4V5Z" />
          <path {...pathProps} d="M9 5v14M15 9l-3 3 3 3" />
        </svg>
      );
    case 'panelOpen':
      return (
        <svg {...common}>
          <path {...pathProps} d="M4 5h16v14H4V5Z" />
          <path {...pathProps} d="M9 5v14M12 9l3 3-3 3" />
        </svg>
      );
    case 'plan':
      return (
        <svg {...common}>
          <path {...pathProps} d="M5 4h14v16H5V4ZM8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path {...pathProps} d="M20 7v5h-5M4 17v-5h5M18.2 12A6.4 6.4 0 0 0 7.1 7.5L4 12M5.8 12a6.4 6.4 0 0 0 11.1 4.5L20 12" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <path {...pathProps} d="m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path {...pathProps} d="M12 16V4m0 0 4 4m-4-4-4 4M5 16v4h14v-4" />
        </svg>
      );
  }
}

function linePath(points: number[][]) {
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

function seasonClass(season: Season) {
  return season === 'Пик' ? 'peak' : season === 'Рост' ? 'growth' : 'decline';
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value) + ' ₽';
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(
    value,
  ) + '%';
}

function formatCompact(value: number) {
  if (value < 50) return value.toFixed(1);
  return Math.round(value).toString();
}

function heatColor(value: number) {
  const hue = Math.round(7 + value * 142);
  const lightness = Math.round(75 - value * 10);
  return `hsl(${hue} 58% ${lightness}%)`;
}

export default App;
