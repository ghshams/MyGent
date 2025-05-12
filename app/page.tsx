'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define the Agent type
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
    inputLabel: 'Upload or paste your text',
    outputPlaceholder: 'Word count result will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'Capitalize',
    description: 'Converts all letters in the input text to uppercase.',
    inputLabel: 'Enter text to capitalize',
    outputPlaceholder: 'Capitalized result will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'TXT Compare',
    description: 'Compares two texts and shows their differences.',
    inputLabel: 'Enter two texts below to compare',
    outputPlaceholder: 'Differences will appear here...'
  },
  {
    category: 'Crypto Tools',
    name: 'Position Suggestion',
    description: 'Suggests possible crypto positions based on market data.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Result will appear here...'
  },
  {
    category: 'Crypto Tools',
    name: 'Top Gainer/Looser',
    description: 'Displays top gaining and losing cryptocurrencies.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Result will appear here...'
  }
];

export default function MyGent() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleRun = () => {
    if (selectedAgent?.name === 'Word Counter') {
      const words = inputText.trim().split(/\s+/);
      const count = words.filter(word => word.length > 0).length;
      setOutputText(`There are ${count} word(s) in the input.`);
    } else if (selectedAgent?.name === 'Capitalize') {
      setOutputText(inputText.toUpperCase());
    } else if (selectedAgent?.name === 'TXT Compare') {
      const diff = inputText === inputText2 ? 'No differences found.' : 'Texts are different.';
      setOutputText(diff);
    } else {
      setOutputText(`Result for "${selectedAgent?.name}" will show here.`);
    }
  };

  const categories = [...new Set(agents.map(agent => agent.category))];

  return (
    <div className="grid grid-cols-12 h-screen font-poppins bg-gradient-to-br from-gray-50 to-green-100 pt-12">
      <div className="col-span-2 bg-gray-400 p-4 border-r overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="Logo" width={58} height={58} />
          <h1 className="text-xl font-bold text-green-800">MyGent AI</h1>
        </div>
        {categories.map(cat => (
          <details key={cat} className="mb-4">
            <summary className="text-lg font-semibold text-gray-100 cursor-pointer select-none py-1">
              {cat}
            </summary>
            <div className="ml-3 mt-2 space-y-2">
              {agents.filter(agent => agent.category === cat).map(agent => (
                <Button
                  key={agent.name}
                  className="w-full justify-start text-left px-3 py-2"
                  variant={selectedAgent?.name === agent.name ? 'default' : 'outline'}
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

      <motion.div
        className="col-span-10 p-10 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {selectedAgent ? (
          <motion.div
            className="p-8 shadow-xl rounded-2xl space-y-6 bg-gray-100 backdrop-blur"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">{selectedAgent.name}</h2>
            <p className="text-gray-500 text-lg">{selectedAgent.description}</p>

            {selectedAgent.name === 'TXT Compare' ? (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-base">First Text</label>
                  <Textarea
                    rows={6}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="mb-3 text-lg"
                    placeholder="Enter first text..."
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-base">Second Text</label>
                  <Textarea
                    rows={6}
                    value={inputText2}
                    onChange={e => setInputText2(e.target.value)}
                    className="mb-3 text-lg"
                    placeholder="Enter second text..."
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block font-semibold mb-1 text-base">{selectedAgent.inputLabel}</label>
                <Textarea
                  rows={10}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="mb-3 text-lg"
                  placeholder="Type or paste here..."
                />
              </div>
            )}

            <Button onClick={handleRun} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg">Run Agent</Button>

            <div>
              <label className="block font-semibold mb-1 text-base">Output</label>
              <Textarea
                rows={10}
                readOnly
                value={outputText}
                placeholder={selectedAgent.outputPlaceholder}
                className="bg-gray-200 text-lg"
              />
              <div className="mt-2 text-right">
                <Button variant="secondary" size="sm">Download Output</Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-gray-500 text-lg text-center mt-20">Select an agent from the left to begin</div>
        )}
      </motion.div>
    </div>
  );
}