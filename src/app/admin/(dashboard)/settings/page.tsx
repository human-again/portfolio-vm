"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import type { AppConfig } from "@/lib/db/types";
import { MODEL_SUGGESTIONS } from "@/lib/llm/models";

const PROVIDERS = [
  { value: "ollama", label: "Ollama (Local)" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
];

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
    return <p role="status" className="text-muted-foreground">Loading settings...</p>;
  }

  const suggestions =
    MODEL_SUGGESTIONS[config.llmProvider as keyof typeof MODEL_SUGGESTIONS] || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="border border-border rounded-xl p-6 max-w-xl space-y-6">
        <div>
          <label htmlFor="llm-provider" className="block text-sm font-medium mb-2">LLM Provider</label>
          <select
            id="llm-provider"
            value={config.llmProvider}
            onChange={(e) => {
              const provider = e.target.value as keyof typeof MODEL_SUGGESTIONS;
              setConfig({
                ...config,
                llmProvider: provider,
                llmModel: MODEL_SUGGESTIONS[provider]?.[0] || "",
              });
            }}
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
          <label htmlFor="llm-model" className="block text-sm font-medium mb-2">Model</label>
          <input
            id="llm-model"
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
          <label htmlFor="llm-temperature" className="block text-sm font-medium mb-2">
            Temperature ({config.llmTemperature})
          </label>
          <input
            id="llm-temperature"
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
          <label htmlFor="llm-max-tokens" className="block text-sm font-medium mb-2">Max Tokens</label>
          <input
            id="llm-max-tokens"
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

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Save size={16} aria-hidden="true" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
          <span role="status" aria-live="polite" className="text-sm text-green-600">
            {saved ? "Settings saved successfully." : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
