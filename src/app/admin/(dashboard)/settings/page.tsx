"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import type { AppConfig } from "@/lib/db/types";

const PROVIDERS = [
  { value: "ollama", label: "Ollama (Local)" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
];

const MODEL_SUGGESTIONS: Record<string, string[]> = {
  ollama: ["llama3.2", "llama3.1", "mistral", "codellama"],
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
  anthropic: ["claude-sonnet-4-20250514", "claude-haiku-4-20250414"],
  groq: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"],
};

export default function SettingsPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save config:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return <p className="text-muted-foreground">Loading settings...</p>;
  }

  const suggestions = MODEL_SUGGESTIONS[config.llmProvider] || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="border border-border rounded-xl p-6 max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">LLM Provider</label>
          <select
            value={config.llmProvider}
            onChange={(e) =>
              setConfig({
                ...config,
                llmProvider: e.target.value,
                llmModel: MODEL_SUGGESTIONS[e.target.value]?.[0] || "",
              })
            }
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <input
            type="text"
            value={config.llmModel}
            onChange={(e) => setConfig({ ...config, llmModel: e.target.value })}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
            list="model-suggestions"
          />
          <datalist id="model-suggestions">
            {suggestions.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Temperature ({config.llmTemperature})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.llmTemperature}
            onChange={(e) =>
              setConfig({ ...config, llmTemperature: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Tokens</label>
          <input
            type="number"
            value={config.llmMaxTokens}
            onChange={(e) =>
              setConfig({ ...config, llmMaxTokens: Number(e.target.value) })
            }
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
            min={128}
            max={4096}
            step={128}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
