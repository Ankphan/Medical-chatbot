'use client';

import { useState } from 'react';
import './styles.css'; // Import the CSS file

interface Message {
  role: 'doctor' | 'patient';
  content: string;
}

const scenarios = [
  { id: 'hypertension', symptom: 'A 50-year-old male with hypertension and fatigue.', description: 'A 50-year-old male presents with hypertension and fatigue for the last few weeks.' },
  { id: 'dengue', symptom: 'A 45-year-old man with fever, rash, and body aches.', description: 'A 45-year-old man presents with a high fever, body aches, and a rash, suspected of Dengue Fever.' },
  { id: 'construction_injury', symptom: 'A 35-year-old worker with a workplace injury.', description: 'A 35-year-old construction worker diagnosed with a broken leg after a workplace fall.' },
  { id: 'influenza', symptom: 'A 22-year-old college student with fever and cough.', description: 'A 22-year-old college student presents with influenza and anxiety about academic work.' },
];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<string>(scenarios[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const startScenario = () => {
    const currentScenario = scenarios.find((s) => s.id === selectedScenario);
    if (currentScenario) {
      setMessages([{ role: 'patient', content: currentScenario.description }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'doctor', content: input };
    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: selectedScenario, question: input }),
      });

      const data = await response.json();
      const patientMessage: Message = { role: 'patient', content: data.response || 'No response' };

      setMessages((prev) => [...prev, patientMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'patient', content: 'Failed to connect to the server.' },
      ]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="container">
      <div className="chatbox">
        {/* Header */}
        <div className="header">
          <div className="header-icon"></div>
          <h1>Med Chatbot</h1>
          <span>Dynamic Scenario Selector</span>
        </div>

        {/* Scenario Selector */}
        <div className="scenario-selector">
          <label>Select a Scenario:</label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.symptom}
              </option>
            ))}
          </select>
          <button onClick={startScenario}>Start Scenario</button>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="loading">Patient is typing...</div>}
        </div>

        {/* Input Bar */}
        <div className="input-bar">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
