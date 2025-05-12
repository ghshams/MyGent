'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Folder } from 'lucide-react';
import { motion } from 'framer-motion';

type Agent = {
  category: string;
  name: string;
  description: string;
  inputLabel: string;
  outputPlaceholder: string;
};

const agents: Agent[] = [
  {
    category: 'Text Tools',
    name: 'Word Counter',
    description: 'Counts the total number of words in the input text.',
    inputLabel: 'Enter or paste your text',
    outputPlaceholder: 'Word count will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'Capitalize',
    description: 'Converts all letters in the input text to uppercase.',
    inputLabel: 'Enter text to capitalize',
    outputPlaceholder: 'Capitalized text will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'TXT Compare',
    description: 'Compares two text blocks for differences.',
    inputLabel: 'Enter two texts below to compare',
    outputPlaceholder: 'Comparison result will appear here...'
  },
  {
    category: 'Crypto Tools',
    name: 'Position Suggestion',
    description: 'Suggests crypto entry/exit positions based on trends.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Coming soon...'
  },
  {
    category: 'Crypto Tools',
    name: 'Top Gainer/Looser',
    description: 'Shows top performing and worst performing tokens.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Coming soon...'
  }
];

export default function MyGent() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [outputText, setOutputText] = useState('');
  const [search, setSearch] = useState('');

  const categories = [...new Set(agents.map(a => a.category))];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRun = () => {
    if (!selectedAgent) return;
    switch (selectedAgent.name) {
      case 'Word Counter':
        const count = inputText.trim().split(/\s+/).filter(Boolean).length;
        setOutputText(`There are ${count} word(s).`);
        break;
      case 'Capitalize':
        setOutputText(inputText.toUpperCase());
        break;
      case 'TXT Compare':
        setOutputText(
          inputText === inputText2 ? 'No differences found.' : 'Texts are different.'
        );
        break;
      default:
        setOutputText(`"${selectedAgent.name}" is not yet implemented.`);
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen pt-12 bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
      {/* Sidebar */}
      <div className="col-span-3 bg-gray-700 text-white px-4 py-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
          <h1 className="text-2xl font-bold">MyGent</h1>
        </div>

        <Input
          placeholder="Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-md px-3 py-2 text-black bg-white"
        />

        <div className="space-y-4">
          {categories.map(category => (
            <details key={category} open>
              <summary className="flex items-center gap-2 cursor-pointer text-white text-lg font-semibold mb-1">
                <Folder className="w-4 h-4" />
                {category}
              </summary>
              <div className="pl-6 space-y-2">
                {filteredAgents
                  .filter(a => a.category === category)
                  .map(agent => (
                    <Button
                      key={agent.name}
                      variant={selectedAgent?.name === agent.name ? 'default' : 'secondary'}
                      className="w-full text-left text-sm"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setInputText('');
                        setInputText2('');
                        setOutputText('');
                      }}
                    >
                      {agent.name}
                    </Button>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <motion.div
        className="col-span-9 p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {selectedAgent ? (
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{selectedAgent.name}</h2>
            <p className="text-gray-500 text-base">{selectedAgent.description}</p>

            {selectedAgent.name === 'TXT Compare' ? (
              <>
                <div>
                  <label className="block font-medium mb-1">First Text</label>
                  <Textarea
                    rows={6}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="mb-3"
                    placeholder="Enter first text..."
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Second Text</label>
                  <Textarea
                    rows={6}
                    value={inputText2}
                    onChange={e => setInputText2(e.target.value)}
                    className="mb-3"
                    placeholder="Enter second text..."
                  />
                </div>
              </>
            ) : selectedAgent.inputLabel !== 'N/A' ? (
              <div>
                <label className="block font-medium mb-1">{selectedAgent.inputLabel}</label>
                <Textarea
                  rows={8}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="mb-3"
                  placeholder="Type or paste here..."
                />
              </div>
            ) : null}

            <Button
              onClick={handleRun}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg"
            >
              Run Agent
            </Button>

            <div>
              <label className="block font-medium mb-1">Output</label>
              <Textarea
                readOnly
                rows={8}
                value={outputText}
                className="bg-gray-100"
                placeholder={selectedAgent.outputPlaceholder}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20 text-lg">
            Select an agent from the left to begin
          </div>
        )}
      </motion.div>
    </div>
  );
}
