import { useEffect, useMemo, useState } from 'react';

type Channel = 'inApp' | 'email' | 'push';
type SectionId = 'account' | 'funds' | 'support' | 'marketing';
type IconName =
  | 'user'
  | 'chart'
  | 'chat'
  | 'gift'
  | 'bell'
  | 'desktop'
  | 'mail'
  | 'phone'
  | 'info'
  | 'menu'
  | 'profile'
  | 'shield'
  | 'login'
  | 'password'
  | 'wallet'
  | 'cash';

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

type DetailedNotificationRow = NotificationRow & {
  description: string;
};

type DetailedNotificationSectionData = Omit<NotificationSectionData, 'rows'> & {
  rows: DetailedNotificationRow[];
};

type LanguageKey = 'memberArea' | 'email' | 'app';
type Locale = 'en' | 'id';
type CardSectionId = SectionId;

type CardNotification = {
  label: string;
  description: string;
  values: Record<Channel, boolean>;
};

type CardNotificationSection = {
  id: CardSectionId;
  title: string;
  icon: IconName;
  tone: 'red' | 'blue';
  cards: CardNotification[];
};

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

const detailedSections: DetailedNotificationSectionData[] = [
  {
    id: 'account',
    title: 'Account & Security',
    tone: 'error',
    icon: 'user',
    rows: [
      {
        label: 'Registration and Verification',
        description: 'Important updates about your registration and verification',
        values: { inApp: true, email: true, push: false },
      },
      {
        label: 'Accounts',
        description: 'Account updates and important notices',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
  {
    id: 'funds',
    title: 'Funds & Trading',
    tone: 'info',
    icon: 'chart',
    rows: [
      {
        label: 'Deposits',
        description: 'Deposit confirmations and status updates',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Withdrawals',
        description: 'Withdrawal confirmations and status updates',
        values: { inApp: false, email: true, push: true },
      },
      {
        label: 'Strategies',
        description: 'Updates about strategy subscriptions and performance',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Local Depositor',
        description: 'Updates and news for Local Depositor partners',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & Communications',
    tone: 'success',
    icon: 'chat',
    rows: [
      {
        label: 'Tickets',
        description: 'Updates about your support tickets',
        values: { inApp: true, email: false, push: true },
      },
      {
        label: 'Voice messages',
        description: 'Voice message notifications and updates',
        values: { inApp: false, email: true, push: true },
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Programs',
    tone: 'warning',
    icon: 'gift',
    rows: [
      {
        label: 'Bonuses',
        description: 'Bonus offers, promotions and rewards',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Contests',
        description: 'Contest announcements and results',
        values: { inApp: false, email: true, push: false },
      },
      {
        label: 'Partner Program',
        description: 'Updates and news about our Partner Program',
        values: { inApp: true, email: true, push: false },
      },
      {
        label: 'Valetax Store',
        description: 'Redeem bonuses for exclusive rewards and offers',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
];

const cardSections: CardNotificationSection[] = [
  {
    id: 'account',
    title: 'Account & Security',
    icon: 'user',
    tone: 'red',
    cards: [
      {
        label: 'Registration and Verification',
        description: 'Important updates about your registration and verification',
        values: { inApp: true, email: true, push: false },
      },
      {
        label: 'Accounts',
        description: 'Account updates and important notices',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
  {
    id: 'funds',
    title: 'Funds & Trading',
    icon: 'chart',
    tone: 'blue',
    cards: [
      {
        label: 'Deposits',
        description: 'Deposit confirmations and status updates',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Withdrawals',
        description: 'Withdrawal confirmations and status updates',
        values: { inApp: false, email: true, push: true },
      },
      {
        label: 'Strategies',
        description: 'Updates about strategy subscriptions and performance',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Local Depositor',
        description: 'Updates and news for Local Depositor partners',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & Communications',
    icon: 'chat',
    tone: 'blue',
    cards: [
      {
        label: 'Tickets',
        description: 'Updates about your support tickets',
        values: { inApp: true, email: false, push: true },
      },
      {
        label: 'Voice messages',
        description: 'Voice message notifications and updates',
        values: { inApp: false, email: true, push: true },
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Programs',
    icon: 'gift',
    tone: 'blue',
    cards: [
      {
        label: 'Bonuses',
        description: 'Bonus offers, promotions and rewards',
        values: { inApp: true, email: false, push: false },
      },
      {
        label: 'Contests',
        description: 'Contest announcements and results',
        values: { inApp: false, email: true, push: false },
      },
      {
        label: 'Partner Program',
        description: 'Updates and news about our Partner Program',
        values: { inApp: true, email: true, push: false },
      },
      {
        label: 'Valetax Store',
        description: 'Redeem bonuses for exclusive rewards and offers',
        values: { inApp: true, email: false, push: true },
      },
    ],
  },
];

function App() {
  const path = window.location.pathname;
  const locale: Locale = path.includes('index-indonesian') ? 'id' : 'en';
  const isDetailedVariant = path.includes('index-updates');
  const isCardVariant = path.includes('index-cards');

  useEffect(() => {
    document.documentElement.lang = locale === 'id' ? 'id' : 'en';
    document.title = locale === 'id' ? 'Pengaturan Notifikasi Valetax' : 'Valetax Notifications Settings';
  }, [locale, isDetailedVariant, isCardVariant]);

  if (isCardVariant) {
    return <CardSettingsPage />;
  }

  if (isDetailedVariant) {
    return <DetailedSettingsPage />;
  }

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

function DetailedSettingsPage() {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    account: true,
    funds: true,
    support: true,
    marketing: true,
  });
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(
      detailedSections.map((section) => [
        section.id,
        section.rows.map((row) => ({ label: row.label, description: row.description, values: { ...row.values } })),
      ]),
    ) as Record<SectionId, DetailedNotificationRow[]>,
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
      <section className="phone-frame detailed-frame" aria-label="Settings Notifications detailed prototype">
        <Header />
        <div className="page-content detailed-content">
          <h1>Settings</h1>
          <SettingsTabs locale="en" />
          <section className="updates-intro">
            <span className="section-icon neutral">
              <Icon name="bell" />
            </span>
            <span>
              <h2>Manage how you receive updates</h2>
              <p>Choose where you want to receive each type of notification</p>
            </span>
          </section>
          <div className="detailed-list">
            {detailedSections.map((section) => (
              <DetailedNotificationSection
                key={section.id}
                section={section}
                rows={settings[section.id]}
                expanded={openSections[section.id]}
                onToggleOpen={() =>
                  setOpenSections((current) => ({ ...current, [section.id]: !current[section.id] }))
                }
                onToggle={(rowIndex, channel) => toggleNotification(section.id, rowIndex, channel)}
              />
            ))}
          </div>
          <DetailedNotificationLanguages values={languages} onChange={setLanguages} />
          <SaveButton locale="en" onSave={() => setSaved(true)} />
        </div>
        <Toast locale="en" visible={saved} />
      </section>
    </main>
  );
}

function DetailedNotificationSection({
  section,
  rows,
  expanded,
  onToggleOpen,
  onToggle,
}: {
  section: DetailedNotificationSectionData;
  rows: DetailedNotificationRow[];
  expanded: boolean;
  onToggleOpen: () => void;
  onToggle: (rowIndex: number, channel: Channel) => void;
}) {
  return (
    <article className="detailed-section">
      <button
        className="section-heading detailed-heading"
        type="button"
        aria-expanded={expanded}
        onClick={onToggleOpen}
      >
        <span className={`section-icon ${section.tone}`}>
          <Icon name={section.icon} />
        </span>
        <span className="section-title">{section.title}</span>
        <span className="manage">
          Manage
          <span className={`caret ${expanded ? 'up' : ''}`} aria-hidden="true" />
        </span>
      </button>
      {expanded && (
        <div className="detailed-rows">
          {rows.map((row, rowIndex) => (
            <DetailedNotificationRowItem
              key={row.label}
              row={row}
              rowIndex={rowIndex}
              sectionTitle={section.title}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function DetailedNotificationRowItem({
  row,
  rowIndex,
  sectionTitle,
  onToggle,
}: {
  row: DetailedNotificationRow;
  rowIndex: number;
  sectionTitle: string;
  onToggle: (rowIndex: number, channel: Channel) => void;
}) {
  const channelLabels: Record<Channel, string> = {
    inApp: 'In-App',
    email: 'Email',
    push: 'Push',
  };

  return (
    <div className="detailed-row">
      <div className="detailed-row-copy">
        <h3>{row.label}</h3>
        <p>{row.description}</p>
      </div>
      <div className="detailed-channel-row">
        {(['inApp', 'email', 'push'] as Channel[]).map((channel) => (
          <div className="detailed-channel" key={channel}>
            <span>{channelLabels[channel]}</span>
            <NotificationToggle
              checked={row.values[channel]}
              label={`${sectionTitle}: ${row.label} ${channelLabels[channel]}`}
              onClick={() => onToggle(rowIndex, channel)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailedNotificationLanguages({
  values,
  onChange,
}: {
  values: Record<LanguageKey, string>;
  onChange: (values: Record<LanguageKey, string>) => void;
}) {
  return (
    <section className="languages detailed-languages" aria-labelledby="detailed-languages-title">
      <div className="languages-heading">
        <span className="section-icon neutral">
          <Icon name="bell" />
        </span>
        <span>
          <h2 id="detailed-languages-title">Notification languages</h2>
        </span>
      </div>
      <div className="select-stack">
        <SelectField
          locale="en"
          label="Member Area Notifications"
          value={values.memberArea}
          onChange={(value) => onChange({ ...values, memberArea: value })}
        />
        <SelectField
          locale="en"
          label="Email Notifications"
          value={values.email}
          onChange={(value) => onChange({ ...values, email: value })}
        />
        <SelectField
          locale="en"
          label="App Notifications"
          value={values.app}
          onChange={(value) => onChange({ ...values, app: value })}
        />
      </div>
      <p className="language-note">
        <Icon name="info" />
        Language changes may take a few minutes to apply
      </p>
    </section>
  );
}

function CardSettingsPage() {
  const [languages, setLanguages] = useState<Record<LanguageKey, string>>({
    memberArea: 'English',
    email: 'Thai',
    app: 'Klingon',
  });
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(
      cardSections.map((section) => [
        section.id,
        section.cards.map((card) => ({ ...card, values: { ...card.values } })),
      ]),
    ) as Record<CardSectionId, CardNotification[]>,
  );

  const toggleCardNotification = (sectionId: CardSectionId, cardIndex: number, channel: Channel) => {
    setSettings((current) => ({
      ...current,
      [sectionId]: current[sectionId].map((card, index) =>
        index === cardIndex ? { ...card, values: { ...card.values, [channel]: !card.values[channel] } } : card,
      ),
    }));
  };

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2600);
    return () => window.clearTimeout(timer);
  }, [saved]);

  return (
    <main className="demo-shell">
      <section className="phone-frame cards-phone-frame" aria-label="Card based notifications prototype">
        <Header />
        <div className="page-content cards-page">
          <h1>Settings</h1>
          <SettingsTabs locale="en" />
          <section className="updates-intro cards-intro">
            <span className="section-icon neutral">
              <Icon name="bell" />
            </span>
            <span>
              <h2>Manage how you receive updates</h2>
              <p>Choose where you want to receive each type of notification</p>
            </span>
          </section>
          {cardSections.map((section) => (
            <CardNotificationSection
              key={section.id}
              section={section}
              cards={settings[section.id]}
              onToggle={(cardIndex, channel) => toggleCardNotification(section.id, cardIndex, channel)}
            />
          ))}
          <DetailedNotificationLanguages values={languages} onChange={setLanguages} />
          <SaveButton locale="en" onSave={() => setSaved(true)} />
        </div>
        <Toast locale="en" visible={saved} />
      </section>
    </main>
  );
}

function CardNotificationSection({
  section,
  cards,
  onToggle,
}: {
  section: CardNotificationSection;
  cards: CardNotification[];
  onToggle: (cardIndex: number, channel: Channel) => void;
}) {
  return (
    <section className="card-section" aria-labelledby={`${section.id}-card-title`}>
      <div className="section-heading card-section-heading">
        <span className={`section-icon ${section.tone === 'red' ? 'error' : section.id === 'marketing' ? 'warning' : section.id === 'support' ? 'success' : 'info'}`}>
          <Icon name={section.icon} />
        </span>
        <h1 id={`${section.id}-card-title`}>{section.title}</h1>
      </div>
      <div className="notification-card-stack">
        {cards.map((card, cardIndex) => (
          <NotificationCard
            key={card.label}
            card={card}
            sectionTitle={section.title}
            onToggle={(channel) => onToggle(cardIndex, channel)}
          />
        ))}
      </div>
    </section>
  );
}

function NotificationCard({
  card,
  sectionTitle,
  onToggle,
}: {
  card: CardNotification;
  sectionTitle: string;
  onToggle: (channel: Channel) => void;
}) {
  const channelLabels: Record<Channel, string> = {
    inApp: 'IN-APP',
    email: 'EMAIL',
    push: 'PUSH',
  };

  return (
    <article className="notification-card">
      <div className="notification-card-copy">
        <div>
          <h2>{card.label}</h2>
          <p>{card.description}</p>
        </div>
      </div>
      <div className="notification-card-controls" aria-label={`${sectionTitle}: ${card.label} channels`}>
        {(['inApp', 'email', 'push'] as Channel[]).map((channel) => (
          <div className="notification-card-control" key={channel}>
            <span>{channelLabels[channel]}</span>
            <LargeNotificationToggle
              checked={card.values[channel]}
              label={`${card.label} ${channelLabels[channel]}`}
              onClick={() => onToggle(channel)}
            />
          </div>
        ))}
      </div>
    </article>
  );
}

function LargeNotificationToggle({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`large-toggle ${checked ? 'checked' : ''}`}
      aria-pressed={checked}
      aria-label={label}
      onClick={onClick}
    >
      <span />
    </button>
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
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5.5 5.4v5.2c0 4.2 2.4 7.5 6.5 9.4 4.1-1.9 6.5-5.2 6.5-9.4V5.4L12 3Z" fill="currentColor" stroke="none" />
          <path d="M12 6v10" stroke="#fff" strokeWidth="2.1" />
          <path d="M8.3 10.2h7.4" stroke="#fff" strokeWidth="2.1" />
        </svg>
      );
    case 'login':
      return (
        <svg {...common}>
          <path d="M13 5h6v14h-6" strokeWidth="2.5" />
          <path d="M4 12h10" strokeWidth="2.5" />
          <path d="m10 7 5 5-5 5" strokeWidth="2.5" />
        </svg>
      );
    case 'password':
      return (
        <svg {...common}>
          <path d="M5 9.2h14" strokeWidth="2.4" />
          <path d="M7 17h10" strokeWidth="2.4" />
          <path d="M7 6.5 8.7 10" strokeWidth="2.4" />
          <path d="m12 6.5-.1 3.5" strokeWidth="2.4" />
          <path d="M17 6.5 15.3 10" strokeWidth="2.4" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M4 7.5h15a2 2 0 0 1 2 2v8H5.5A2.5 2.5 0 0 1 3 15V6.5A2.5 2.5 0 0 1 5.5 4H18v3.5" strokeWidth="2.4" />
          <path d="M15.5 12h5v4h-5a2 2 0 0 1 0-4Z" strokeWidth="2.4" />
        </svg>
      );
    case 'cash':
      return (
        <svg {...common}>
          <path d="M4 7h16v10H4V7Z" strokeWidth="2.3" />
          <path d="M8 7v10" strokeWidth="2.3" />
          <path d="M16 7v10" strokeWidth="2.3" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" strokeWidth="2.3" />
        </svg>
      );
  }
}

export default App;
