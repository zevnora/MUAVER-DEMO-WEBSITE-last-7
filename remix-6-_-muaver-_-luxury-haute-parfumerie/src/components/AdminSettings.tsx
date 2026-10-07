import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Check, 
  X, 
  Phone, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Facebook, 
  DollarSign, 
  Sliders, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Truck,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { SiteSettings, SectionVisibility } from '../types/store';
import { updateSiteSettings, DEFAULT_SETTINGS } from '../services/storeService';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleToggleVisibility = (key: keyof SectionVisibility) => {
    const currentVis: SectionVisibility = formData.visibility || {
      showAnnouncementBar: true,
      showHeroSlider: true,
      showFeaturedProduct: true,
      showBrandStory: true,
      showWhyFeatures: true,
      showTestimonials: true,
      showWhatsAppStrip: true,
    };

    setFormData({
      ...formData,
      visibility: {
        ...currentVis,
        [key]: !currentVis[key],
      },
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setSaving(true);
      // Clean raw WhatsApp digits
      const cleanedRaw = formData.whatsappRawNumber.replace(/\D/g, '');
      const toSave: SiteSettings = {
        ...formData,
        whatsappRawNumber: cleanedRaw || '923242404984',
      };

      await updateSiteSettings(toSave);
      setFormData(toSave);
      await onRefresh();
      showStatus('Settings successfully updated and synchronized with storefront!', 'success');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      showStatus(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const visibility = formData.visibility || {
    showAnnouncementBar: true,
    showHeroSlider: true,
    showFeaturedProduct: true,
    showBrandStory: true,
    showWhyFeatures: true,
    showTestimonials: true,
    showWhatsAppStrip: true,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold-500)]/20">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl text-white font-bold tracking-wide flex items-center gap-2.5">
            <span>Store Configuration & Channels</span>
          </h2>
          <p className="text-xs text-white/60">
            Control business numbers, concierge links, social integrations, currency, and storefront section visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="btn-gold-primary px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[var(--navy-900)]" />
            <span>{saving ? 'Synchronizing...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: General & Contact (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Store Identity */}
          <div className="bg-[#081438] rounded-2xl border border-[var(--gold-500)]/25 p-6 space-y-4 shadow-xl">
            <div className="pb-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold-300)]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Store Identity & Nomenclature
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Website & Browser Tab Title
                </label>
                <input
                  type="text"
                  value={formData.siteTitle}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  placeholder="MUAVER | Luxury Brand"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[var(--gold-500)]"
                />
                <span className="text-[9px] text-white/40 block mt-1">
                  Displayed in the browser tab, bookmarks, and search results.
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Tagline (Shown in Header & Footer)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none focus:border-[var(--gold-500)]"
                />
                <span className="text-[9px] text-white/40 block mt-1">
                  Motto displayed across header crest and footer credentials.
                </span>
              </div>
            </div>

            {/* Favicon URL with Live Preview */}
            <div className="p-3.5 rounded-xl bg-[var(--navy-900)] border border-[var(--gold-500)]/20">
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-2 font-semibold">
                Browser Tab Favicon & Monogram Icon URL
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#050F2E] border border-[var(--gold-500)]/40 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
                  <img
                    src={formData.iconUrl || 'https://i.ibb.co/M5Dq0xS9/Icon.png'}
                    alt="Favicon Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://i.ibb.co/M5Dq0xS9/Icon.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.iconUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iconUrl: e.target.value,
                        faviconUrl: e.target.value,
                      })
                    }
                    placeholder="https://i.ibb.co/M5Dq0xS9/Icon.png"
                    className="w-full px-3 py-2 rounded bg-[#081438] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[var(--gold-500)]"
                  />
                  <span className="text-[9px] text-white/40 block mt-1">
                    Direct image URL for the browser tab icon and mobile touch icons (e.g. https://i.ibb.co/M5Dq0xS9/Icon.png).
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  placeholder="PKR"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  placeholder="Rs."
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                Complimentary Shipping Notice
              </label>
              <input
                type="text"
                value={formData.freeShippingNotice}
                onChange={(e) => setFormData({ ...formData, freeShippingNotice: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Contact & WhatsApp Concierge */}
          <div className="bg-[#081438] rounded-2xl border border-[var(--gold-500)]/25 p-6 space-y-4 shadow-xl">
            <div className="pb-3 border-b border-white/10 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Concierge Contact & WhatsApp Ordering
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Display WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+92 324 2404984"
                    className="w-full pl-9 pr-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  WhatsApp Raw Digits (For wa.me links)
                </label>
                <input
                  type="text"
                  value={formData.whatsappRawNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappRawNumber: e.target.value })}
                  placeholder="923242404984"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[9px] text-white/40 block mt-1">Country code + number without plus (e.g. 923242404984)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Customer Telephone Hotline
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+92 324 2404984"
                    className="w-full pl-9 pr-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Official Executive Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="hellomuaver@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Social Media Links */}
          <div className="bg-[#081438] rounded-2xl border border-[var(--gold-500)]/25 p-6 space-y-4 shadow-xl">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[var(--gold-300)]" />
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Social Media Channels
                </h3>
              </div>
              <span className="text-[10px] text-white/40 italic">Icons hide automatically if field is empty</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...(formData.socialLinks || {} as any), instagram: e.target.value },
                    })
                  }
                  placeholder="https://www.instagram.com/muaver.co"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  TikTok Channel Link
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.tiktok || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...(formData.socialLinks || {} as any), tiktok: e.target.value },
                    })
                  }
                  placeholder="https://www.tiktok.com/@muaver.co"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-heading tracking-widest text-[var(--gold-300)] block mb-1">
                  Facebook Page Link
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...(formData.socialLinks || {} as any), facebook: e.target.value },
                    })
                  }
                  placeholder="https://www.facebook.com/people/Muaver-Luxury-Brand/61592411954625/"
                  className="w-full px-3 py-2 rounded bg-[var(--navy-900)] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Section Visibility Toggles (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#081438] rounded-2xl border border-[var(--gold-500)]/25 p-6 space-y-5 shadow-xl sticky top-24">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--gold-300)]" />
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Section Visibility
                </h3>
              </div>
              <span className="text-[10px] text-white/40 font-mono">Live Toggle</span>
            </div>

            <p className="text-xs text-white/60">
              Instantly enable or disable sections on the public storefront without deleting content.
            </p>

            <div className="space-y-3.5 pt-1">
              {/* Announcement Bar */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Announcement Bar</span>
                  <span className="text-[10px] text-white/40">Top royal gold ticker</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showAnnouncementBar')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showAnnouncementBar ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showAnnouncementBar ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Hero Banner Slider */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Hero Banner Slider</span>
                  <span className="text-[10px] text-white/40">5s auto-rotating slider</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showHeroSlider')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showHeroSlider ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showHeroSlider ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Featured Product Spotlight */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Featured Spotlight</span>
                  <span className="text-[10px] text-white/40">Hero product spotlight section</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showFeaturedProduct')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showFeaturedProduct ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showFeaturedProduct ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Brand Story */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Brand Story</span>
                  <span className="text-[10px] text-white/40">Heritage & brand story</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showBrandStory')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showBrandStory ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showBrandStory ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Why MUAVER Features */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">"Why MUAVER" 4 Pillars</span>
                  <span className="text-[10px] text-white/40">Authentic, Long-Lasting, COD, Luxury Box</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showWhyFeatures')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showWhyFeatures ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showWhyFeatures ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Testimonials */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Patron Acclaim</span>
                  <span className="text-[10px] text-white/40">Customer reviews strip</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showTestimonials')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showTestimonials ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showTestimonials ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Strip */}
              <div className="p-3 rounded-xl bg-[var(--navy-900)] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">WhatsApp Order Callout</span>
                  <span className="text-[10px] text-white/40">Pre-footer concierge bar</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility('showWhatsAppStrip')}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    visibility.showWhatsAppStrip ? 'bg-[var(--gold-500)]' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      visibility.showWhatsAppStrip ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave()}
                className="btn-gold-primary w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-[var(--navy-900)]" />
                <span>Save Visibility State</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
