'use client';

import { useState } from 'react';
import { Code2, Bug, RefreshCw, Zap, ArrowRightLeft, Search, Shield, TestTube, Gauge, Copy, Sparkles } from 'lucide-react';

const ACTIONS = [
  { id: 'generate', name: 'Generate', icon: Zap, color: 'text-yellow-400', bg: 'from-yellow-600 to-orange-600', desc: 'Create new code' },
  { id: 'explain', name: 'Explain', icon: Sparkles, color: 'text-blue-400', bg: 'from-blue-600 to-indigo-600', desc: 'Understand code' },
  { id: 'debug', name: 'Debug', icon: Bug, color: 'text-red-400', bg: 'from-red-600 to-pink-600', desc: 'Find & fix bugs' },
  { id: 'refactor', name: 'Refactor', icon: RefreshCw, color: 'text-green-400', bg: 'from-green-600 to-emerald-600', desc: 'Improve quality' },
  { id: 'convert', name: 'Convert', icon: ArrowRightLeft, color: 'text-purple-400', bg: 'from-purple-600 to-violet-600', desc: 'Change language' },
  { id: 'review', name: 'Review', icon: Search, color: 'text-cyan-400', bg: 'from-cyan-600 to-blue-600', desc: 'Code review' },
  { id: 'optimize', name: 'Optimize', icon: Gauge, color: 'text-orange-400', bg: 'from-orange-600 to-red-600', desc: 'Boost perf' },
  { id: 'test', name: 'Test', icon: TestTube, color: 'text-emerald-400', bg: 'from-emerald-600 to-teal-600', desc: 'Generate tests' },
];

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java',
  'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala',
];

const SAMPLE_CODE: Record<string, string> = {
  generate: '// Create a React hook for debouncing API calls with loading state',
  explain: 'const memoize = (fn) => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache[key] === undefined) {\n      cache[key] = fn(...args);\n    }\n    return cache[key];\n  };\n};',
  debug: 'async function fetchUsers() {\n  const response = await fetch("/api/users")\n  const data = response.json()\n  return data.map(user => user.name)\n}',
  refactor: 'function processItems(items) {\n  let result = [];\n  for (let i = 0; i < items.length; i++) {\n    if (items[i].active == true && items[i].age > 18) {\n      let name = items[i].name;\n      let email = items[i].email;\n      result.push({ name: name, email: email });\n    }\n  }\n  return result;\n}',
  convert: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}',
  review: 'app.post("/login", (req, res) => {\n  const { username, password } = req.body;\n  const query = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`;\n  db.query(query, (err, result) => {\n    if (result.length > 0) {\n      res.json({ token: "abc123" });\n    }\n  });\n});',
  optimize: 'function findDuplicates(arr) {\n  const duplicates = [];\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n        duplicates.push(arr[i]);\n      }\n    }\n  }\n  return duplicates;\n}',
  test: 'function calculateDiscount(price, percentage) {\n  if (price < 0 || percentage < 0 || percentage > 100) return null;\n  return price * (1 - percentage / 100);\n}',
};

export default function Home() {
  const [code, setCode] = useState('');
  const [action, setAction] = useState('generate');
  const [language, setLanguage] = useState('TypeScript');
  const [targetLang, setTargetLang] = useState('Python');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const processCode = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action, language, targetLang }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: unknown) {
      setResult(`❌ Error: ${err instanceof Error ? err.message : 'Failed to process'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setCode(SAMPLE_CODE[action] || '');
    setResult('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Code2 size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                AI Code Assistant
              </h1>
              <p className="text-gray-400 text-sm">Generate, debug, explain & optimize code</p>
            </div>
          </div>
        </header>

        {/* Action Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {ACTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => { setAction(a.id); setCode(SAMPLE_CODE[a.id] || ''); setResult(''); }}
              className={`p-3 rounded-xl text-center transition-all ${
                action === a.id
                  ? `bg-gradient-to-br ${a.bg} shadow-lg ring-2 ring-white/20`
                  : 'bg-gray-900 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <a.icon size={20} className={`mx-auto mb-1 ${a.color}`} />
              <span className="block text-sm font-medium">{a.name}</span>
              <span className="block text-xs text-gray-400 mt-0.5">{a.desc}</span>
            </button>
          ))}
        </div>

        {/* Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <Code2 size={16} className="text-green-400" />
                {action === 'generate' ? 'Description' : 'Input Code'}
              </h2>
              <div className="flex gap-2">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs border border-gray-700"
                >
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
                {action === 'convert' && (
                  <>
                    <ArrowRightLeft size={16} className="text-gray-500 self-center" />
                    <select
                      value={targetLang}
                      onChange={e => setTargetLang(e.target.value)}
                      className="bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs border border-gray-700"
                    >
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </>
                )}
                <button
                  onClick={loadSample}
                  className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg text-gray-400 transition-colors"
                >
                  Sample
                </button>
              </div>
            </div>

            <textarea
              className="w-full h-80 bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-green-400 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder={action === 'generate' ? 'Describe what code you want to generate...\ne.g., "Create a React hook for debouncing"' : 'Paste your code here...'}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
            />

            <button
              onClick={processCode}
              disabled={loading || !code.trim()}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-50 rounded-xl py-3.5 font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RefreshCw size={18} className="animate-spin" /> Processing...</>
              ) : (
                <span className="flex items-center gap-2">{ACTIONS.find(a => a.id === action)?.name}</span>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                Output
              </h2>
              {result && !result.startsWith('❌') && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm transition-colors"
                >
                  {copied ? '✅ Copied!' : <><Copy size={14} /> Copy</>}
                </button>
              )}
            </div>

            <div className="h-[380px] overflow-y-auto bg-gray-800 rounded-xl p-4">
              {result ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200 leading-relaxed">
                  {result}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-5xl mb-3 text-gray-700">
                      <Code2 size={48} />
                    </div>
                    <p className="font-medium">Select an action and enter code</p>
                    <p className="text-sm mt-1">Click &quot;Sample&quot; to load example code</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '⚡', title: '8 Actions', desc: 'Generate, explain, debug, refactor, convert, review, optimize, test' },
            { icon: '🌐', title: '14 Languages', desc: 'JS, TS, Python, Rust, Go, Java, C++, C#, PHP, Ruby, Swift, Kotlin, Dart, Scala' },
            { icon: '🤖', title: 'Mimo v2.5', desc: 'Powered by Xiaomi latest AI model' },
            { icon: '📋', title: 'Copy & Paste', desc: 'One-click copy output to clipboard' },
          ].map((f, i) => (
            <div key={i} className="bg-gray-900/50 rounded-xl p-4 text-center">
              <span className="text-2xl">{f.icon}</span>
              <p className="font-medium text-sm mt-1">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
