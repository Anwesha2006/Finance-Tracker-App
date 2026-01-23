'use client'

import { Save, Lock, Bell, User } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    email: 'anwesha.birati@example.com',
    fullName: 'Anwesha Baidya',
    currency: 'Rupee',
    language: 'English',
    notifications: true,
    emailAlerts: true,
    monthlyReport: true,
    twoFactor: false,
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Account Settings */}
      <Section title="Account Settings" icon={<User size={24} />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            value={settings.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          <InputField
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <SelectField
            label="Currency"
            value={settings.currency}
            options={[
              ['RS', 'Rupees(₹)'],
              ['EUR', 'Euro (€)'],
              ['GBP', 'British Pound (£)'],
              ['JPY', 'Japanese Yen (¥)'],
            ]}
            onChange={(e) => handleChange('currency', e.target.value)}
          />
          <SelectField
            label="Language"
            value={settings.language}
            options={[
              ['English', 'English'],
              ['Spanish', 'Español'],
              ['French', 'Français'],
              ['German', 'Deutsch'],
            ]}
            onChange={(e) => handleChange('language', e.target.value)}
          />
        </div>
      </Section>

      {/* Notifications */}
      <ToggleSection
        icon={<Bell size={24} />}
        title="Notifications"
        items={[
          {
            key: 'notifications',
            title: 'Enable Notifications',
            desc: 'Get alerts for important account activity',
          },
          {
            key: 'emailAlerts',
            title: 'Email Alerts',
            desc: 'Receive email notifications for transactions',
          },
          {
            key: 'monthlyReport',
            title: 'Monthly Report',
            desc: 'Receive monthly financial summary',
          },
        ]}
        settings={settings}
        onToggle={handleToggle}
      />

      {/* Security */}
      <ToggleSection
        icon={<Lock size={24} />}
        title="Security"
        items={[
          {
            key: 'twoFactor',
            title: 'Two-Factor Authentication',
            desc: 'Add an extra layer of security to your account',
          },
        ]}
        settings={settings}
        onToggle={handleToggle}
        extraButtons
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-lg font-semibold">
          <Save size={20} />
          Save Changes
        </button>
        <button className="flex-1 py-3 rounded-lg border border-border font-semibold">
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ---------- Reusable Components ---------- */

function Section({ title, icon, children }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-accent">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-muted border border-border rounded-lg"
      />
    </div>
  )
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-muted border border-border rounded-lg"
      >
        {options.map(([val, text]) => (
          <option key={val} value={val}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleSection({ icon, title, items, settings, onToggle, extraButtons }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-accent">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            desc={item.desc}
            enabled={settings[item.key]}
            onClick={() => onToggle(item.key)}
          />
        ))}

        {extraButtons && (
          <>
            <button className="w-full py-3 rounded-lg border border-border font-semibold">
              Change Password
            </button>
            <button className="w-full py-3 rounded-lg border border-destructive text-destructive font-semibold">
              Delete Account
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ToggleRow({ title, desc, enabled, onClick }) {
  return (
    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={onClick}
        className={`relative inline-flex h-8 w-14 items-center rounded-full ${
          enabled ? 'bg-accent' : 'bg-muted border border-border'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 bg-white rounded-full transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
