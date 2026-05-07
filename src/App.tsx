import { useEffect, useMemo, useState } from 'react';

type Channel = 'inApp' | 'email' | 'push';
type SectionId = 'account' | 'funds' | 'support' | 'marketing';
type IconName = 'user' | 'chart' | 'chat' | 'gift' | 'bell' | 'desktop' | 'mail' | 'phone' | 'info' | 'menu' | 'profile';

type NotificationRow = {
  label: string;
  values: Record<Channel, boolean>;
};

type NotificationSectionData = {
  id: SectionId;
  title: string;
  tone: 'error' | 'info' | 'success' | 'warning';
  icon: IconName;
  rows: NotificationRow[];
};

type LanguageKey = 'memberArea' | 'email' | 'app';
type Locale = 'en' | 'id';

const translations: Record<Locale, Record<string, string>> = {
  en: {},
  id: {
    'Settings': 'Pengaturan',
    'Profile Information': 'Informasi Profil',
    'Security': 'Keamanan',
    'Notifications': 'Notifikasi',
    'Shipping Address': 'Alamat Pengiriman',
    'Account & Security': 'Akun & Keamanan',
    'Funds & Trading': 'Dana & Perdagangan',
    'Support & Communications': 'Dukungan & Komunikasi',
    'Marketing & Programs': 'Pemasaran & Program',
    'Manage': 'Kelola',
    'In-App': 'Di Aplikasi',
    'Email': 'Email',
    'Push': 'Push',
    'Registration and Verification': 'Pendaftaran dan Verifikasi',
    'Accounts': 'Akun',
    'Deposits': 'Deposit',
    'Withdrawals': 'Penarikan',
    'Strategies': 'Strategi',
    'Local Depositor': 'Penyetor Lokal',
    'Tickets': 'Tiket',
    'Voice messages': 'Pesan Suara',
    'Bonuses': 'Bonus',
    'Contests': 'Kontes',
    'Partner Program': 'Program Mitra',
    'Valetax Store': 'Toko Valetax',
    'Notification languages': 'Bahasa Notifikasi',
    'Choose your preferred languages for each channel': 'Pilih bahasa pilihan untuk setiap kanal',
    'Member Area Notifications': 'Notifikasi Area Anggota',
    'Email Notifications': 'Notifikasi Email',
    'App Notifications': 'Notifikasi Aplikasi',
    'Language changes may take a few minutes to apply': 'Perubahan bahasa mungkin perlu beberapa menit untuk diterapkan',
    'Save Changes': 'Simpan Perubahan',
    'Changes saved': 'Perubahan disimpan',
    'English': 'Inggris',
    'Thai': 'Thailand',
    'Klingon': 'Klingon',
    'Spanish': 'Spanyol',
    'Portuguese': 'Portugis',
    'Vietnamese': 'Vietnam',
    'Arabic': 'Arab',
  },
};

const t = (locale: Locale, text: string) => translations[locale][text] ?? text;

const sections: NotificationSectionData[] = [
  {
    id: 'account',
    title: 'Account & Security',
    tone: 'error',
    icon: 'user',
    rows: [
      { label: 'Registration and Verification', values: { inApp: false, email: true, push: true } },
      { label: 'Accounts', values: { inApp: true, email: false, push: false } },
    ],
  },
  {
    id: 'funds',
    title: 'Funds & Trading',
    tone: 'info',
    icon: 'chart',
    rows: [
      { label: 'Deposits', values: { inApp: false, email: true, push: true } },
      { label: 'Withdrawals', values: { inApp: true, email: false, push: false } },
      { label: 'Strategies', values: { inApp: true, email: false, push: true } },
      { label: 'Local Depositor', values: { inApp: true, email: true, push: false } },
    ],
  },
  {
    id: 'support',
    title: 'Support & Communications',
    tone: 'success',
    icon: 'chat',
    rows: [
      { label: 'Tickets', values: { inApp: false, email: true, push: true } },
      { label: 'Voice messages', values: { inApp: true, email: false, push: false } },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Programs',
    tone: 'warning',
    icon: 'gift',
    rows: [
      { label: 'Bonuses', values: { inApp: false, email: true, push: true } },
      { label: 'Contests', values: { inApp: false, email: false, push: false } },
      { label: 'Partner Program', values: { inApp: true, email: false, push: true } },
      { label: 'Valetax Store', values: { inApp: true, email: false, push: false } },
    ],
  },
];

const languageOptions = ['English', 'Thai', 'Klingon', 'Spanish', 'Portuguese', 'Vietnamese', 'Arabic'];

function App() {
  const locale: Locale = window.location.pathname.includes('index-indonesian') ? 'id' : 'en';

  useEffect(() => {
    document.documentElement.lang = locale === 'id' ? 'id' : 'en';
    document.title = locale === 'id' ? 'Pengaturan Notifikasi Valetax' : 'Valetax Notifications Settings';
  }, [locale]);

  return <SettingsPage locale={locale} />;
}

function SettingsPage({ locale }: { locale: Locale }) {
  const [openSection, setOpenSection] = useState<SectionId>('account');
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(
      sections.map((section) => [
        section.id,
        section.rows.map((row) => ({ label: row.label, values: { ...row.values } })),
      ]),
    ) as Record<SectionId, NotificationRow[]>,
  );
  const [languages, setLanguages] = useState<Record<LanguageKey, string>>({
    memberArea: 'English',
    email: 'Thai',
    app: 'Klingon',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2600);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const sectionRows = useMemo(
    () =>
      Object.fromEntries(sections.map((section) => [section.id, settings[section.id]])) as Record<
        SectionId,
        NotificationRow[]
      >,
    [settings],
  );

  const toggleNotification = (sectionId: SectionId, rowIndex: number, channel: Channel) => {
    setSettings((current) => ({
      ...current,
      [sectionId]: current[sectionId].map((row, index) =>
        index === rowIndex ? { ...row, values: { ...row.values, [channel]: !row.values[channel] } } : row,
      ),
    }));
  };

  return (
    <main className="demo-shell">
      <section className="phone-frame" aria-label={`${t(locale, 'Settings')} ${t(locale, 'Notifications')} prototype`}>
        <Header />
        <div className="page-content">
          <h1>{t(locale, 'Settings')}</h1>
          <SettingsTabs locale={locale} />
          <NotificationAccordion
            locale={locale}
            openSection={openSection}
            rowsBySection={sectionRows}
            onOpen={setOpenSection}
            onToggle={toggleNotification}
          />
          <NotificationLanguages locale={locale} values={languages} onChange={setLanguages} />
          <SaveButton locale={locale} onSave={() => setSaved(true)} />
        </div>
        <Toast locale={locale} visible={saved} />
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Valetax home" onClick={(event) => event.preventDefault()}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 28 18" role="img">
            <path d="M2 3.2 10.8 13 15.4 7.6" />
            <path d="M13 3.2 18.1 13 26 3.2" />
          </svg>
        </span>
        <span>Valetax</span>
      </a>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Open user profile">
          <Icon name="profile" />
        </button>
        <button className="icon-button" type="button" aria-label="Open menu">
          <Icon name="menu" />
        </button>
      </div>
    </header>
  );
}

function SettingsTabs({ locale }: { locale: Locale }) {
  const tabs = ['Profile Information', 'Security', 'Notifications', 'Shipping Address'];

  return (
    <nav className="tabs" aria-label={`${t(locale, 'Settings')} sections`}>
      {tabs.map((tab) => (
        <button key={tab} className={`tab ${tab === 'Notifications' ? 'active' : ''}`} type="button">
          {t(locale, tab)}
        </button>
      ))}
    </nav>
  );
}

function NotificationAccordion({
  locale,
  openSection,
  rowsBySection,
  onOpen,
  onToggle,
}: {
  locale: Locale;
  openSection: SectionId;
  rowsBySection: Record<SectionId, NotificationRow[]>;
  onOpen: (sectionId: SectionId) => void;
  onToggle: (sectionId: SectionId, rowIndex: number, channel: Channel) => void;
}) {
  return (
    <div className="notification-list">
      {sections.map((section) => (
        <NotificationSection
          key={section.id}
          locale={locale}
          section={section}
          rows={rowsBySection[section.id]}
          expanded={openSection === section.id}
          onOpen={() => onOpen(section.id)}
          onToggle={(rowIndex, channel) => onToggle(section.id, rowIndex, channel)}
        />
      ))}
    </div>
  );
}

function NotificationSection({
  locale,
  section,
  rows,
  expanded,
  onOpen,
  onToggle,
}: {
  locale: Locale;
  section: NotificationSectionData;
  rows: NotificationRow[];
  expanded: boolean;
  onOpen: () => void;
  onToggle: (rowIndex: number, channel: Channel) => void;
}) {
  const panelId = `${section.id}-panel`;

  return (
    <article className="notification-section">
      <button
        className="section-heading"
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onOpen}
      >
        <span className={`section-icon ${section.tone}`}>
          <Icon name={section.icon} />
        </span>
        <span className="section-title">{t(locale, section.title)}</span>
        <span className="manage">
          {t(locale, 'Manage')}
          <span className={`caret ${expanded ? 'up' : ''}`} aria-hidden="true" />
        </span>
      </button>
      {expanded && (
        <div id={panelId} className="notification-table">
          <div className="table-label-spacer" aria-hidden="true" />
          <ChannelHeader label={t(locale, 'In-App')} icon="desktop" />
          <ChannelHeader label={t(locale, 'Email')} icon="mail" />
          <ChannelHeader label={t(locale, 'Push')} icon="phone" />
          {rows.map((row, rowIndex) => (
            <NotificationRowItem
              key={row.label}
              locale={locale}
              row={row}
              rowIndex={rowIndex}
              sectionTitle={t(locale, section.title)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function ChannelHeader({ label, icon }: { label: string; icon: IconName }) {
  return (
    <div className="channel-header">
      <span>{label}</span>
      <Icon name={icon} />
    </div>
  );
}

function NotificationRowItem({
  locale,
  row,
  rowIndex,
  sectionTitle,
  onToggle,
}: {
  locale: Locale;
  row: NotificationRow;
  rowIndex: number;
  sectionTitle: string;
  onToggle: (rowIndex: number, channel: Channel) => void;
}) {
  return (
    <>
      <div className="event-name">{t(locale, row.label)}</div>
      {(['inApp', 'email', 'push'] as Channel[]).map((channel) => (
        <div className="toggle-cell" key={channel}>
          <NotificationToggle
            checked={row.values[channel]}
            label={`${sectionTitle}: ${t(locale, row.label)} ${channel}`}
            onClick={() => onToggle(rowIndex, channel)}
          />
        </div>
      ))}
    </>
  );
}

function NotificationToggle({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? 'checked' : ''}`}
      aria-pressed={checked}
      aria-label={label}
      onClick={onClick}
    >
      <span />
    </button>
  );
}

function NotificationLanguages({
  locale,
  values,
  onChange,
}: {
  locale: Locale;
  values: Record<LanguageKey, string>;
  onChange: (values: Record<LanguageKey, string>) => void;
}) {
  return (
    <section className="languages" aria-labelledby="languages-title">
      <div className="languages-heading">
        <span className="section-icon neutral">
          <Icon name="bell" />
        </span>
        <span>
          <h2 id="languages-title">{t(locale, 'Notification languages')}</h2>
          <p>{t(locale, 'Choose your preferred languages for each channel')}</p>
        </span>
      </div>
      <div className="select-stack">
        <SelectField
          locale={locale}
          label="Member Area Notifications"
          value={values.memberArea}
          onChange={(value) => onChange({ ...values, memberArea: value })}
        />
        <SelectField
          locale={locale}
          label="Email Notifications"
          value={values.email}
          onChange={(value) => onChange({ ...values, email: value })}
        />
        <SelectField
          locale={locale}
          label="App Notifications"
          value={values.app}
          onChange={(value) => onChange({ ...values, app: value })}
        />
      </div>
      <p className="language-note">
        <Icon name="info" />
        {t(locale, 'Language changes may take a few minutes to apply')}
      </p>
    </section>
  );
}

function SelectField({
  locale,
  label,
  value,
  onChange,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="select-field">
      <span>{t(locale, label)}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {languageOptions.map((option) => (
          <option key={option} value={option}>
            {t(locale, option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function SaveButton({ locale, onSave }: { locale: Locale; onSave: () => void }) {
  return (
    <button className="save-button" type="button" onClick={onSave}>
      {t(locale, 'Save Changes')}
    </button>
  );
}

function Toast({ locale, visible }: { locale: Locale; visible: boolean }) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      {t(locale, 'Changes saved')}
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;

  switch (name) {
    case 'user':
      return (
        <svg {...common}>
          <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path d="M6.5 18.6c.7-2.7 2.6-4 5.5-4s4.8 1.3 5.5 4H6.5Z" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M5 17V9" />
          <path d="M10 17V5" />
          <path d="M15 17v-6" />
          <path d="M20 17V7" />
          <path d="m4.5 15.5 4-4 3 3 6-7" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M5 6.5h14v10H8.6L5 19.5v-13Z" />
          <path d="M8.5 10h7" />
          <path d="M8.5 13h5" />
        </svg>
      );
    case 'gift':
      return (
        <svg {...common}>
          <path d="M4.5 9.5h15v10h-15v-10Z" />
          <path d="M3.5 6.5h17v3h-17v-3Z" />
          <path d="M12 6.5v13" />
          <path d="M12 6.5c-2.2 0-3.7-.9-3.7-2 0-.8.7-1.3 1.5-1.3 1.4 0 2.2 1.4 2.2 3.3Z" />
          <path d="M12 6.5c2.2 0 3.7-.9 3.7-2 0-.8-.7-1.3-1.5-1.3-1.4 0-2.2 1.4-2.2 3.3Z" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M7 17h10" />
          <path d="M9 17V10a3 3 0 1 1 6 0v7" />
          <path d="M10.5 20h3" />
        </svg>
      );
    case 'desktop':
      return (
        <svg {...common}>
          <path d="M4 5.5h16v10H4v-10Z" />
          <path d="M9 19h6" />
          <path d="M12 15.5V19" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <path d="M4 6.5h16v11H4v-11Z" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M8 3.5h8v17H8v-17Z" />
          <path d="M11 17.5h2" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common} viewBox="0 0 16 16" width="16" height="16">
          <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
          <path d="M8 7.2v3.4" />
          <path d="M8 5.3h.01" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M5 7h14" />
          <path d="M5 12h14" />
          <path d="M5 17h14" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...common}>
          <path d="M12 11.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" fill="currentColor" stroke="none" />
          <path d="M5.2 20c.8-4 3-6 6.8-6s6 2 6.8 6H5.2Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export default App;
