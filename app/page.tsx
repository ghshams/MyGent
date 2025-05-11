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
    category: 'Utilities',
    name: 'To-Do Generator',
    description: 'Generates a to-do list from your notes.',
    inputLabel: 'Enter your notes or upload a file',
    outputPlaceholder: 'Generated to-do list...'
  }
];

export default function MyGent() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleRun = () => {
    if (selectedAgent?.name === 'Word Counter') {
      const words = inputText.trim().split(/\s+/);
      const count = words.filter(word => word.length > 0).length;
      setOutputText(`There are ${count} word(s) in the input.`);
    } else if (selectedAgent?.name === 'Capitalize') {
      setOutputText(inputText.toUpperCase());
    } else {
      setOutputText(`Result for "${selectedAgent?.name}" will show here.`);
    }
  };

  const categories = [...new Set(agents.map(agent => agent.category))];

  return (
    <div className="grid grid-cols-12 h-screen font-poppins bg-gradient-to-br from-gray-50 to-green-100 pt-12">
      <div className="col-span-2 bg-gray-200 p-4 border-r overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <h1 className="text-xl font-bold text-green-700">MyGent AI</h1>
        </div>
        {categories.map(cat => (
          <div key={cat} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">{cat}</h3>
            {agents.filter(agent => agent.category === cat).map(agent => (
              <Button
                key={agent.name}
                className="w-full mb-2 justify-start text-left px-3 py-2"
                variant={selectedAgent?.name === agent.name ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAgent(agent);
                  setInputText('');
                  setOutputText('');
                }}
              >
                {agent.name}
              </Button>
            ))}
          </div>
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
            className="p-8 shadow-xl rounded-2xl space-y-6 bg-white/90 backdrop-blur"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">{selectedAgent.name}</h2>
            <p className="text-gray-500 text-lg">{selectedAgent.description}</p>

            <div>
              <label className="block font-semibold mb-1 text-base">{selectedAgent.inputLabel}</label>
              <Textarea
                rows={10}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="mb-3 text-lg"
                placeholder="Type or paste here..."
              />
              <div className="flex items-center gap-3">
                <input type="file" className="text-sm" />
                <Button variant="secondary" size="sm" className="flex items-center gap-1">
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            </div>

            <Button onClick={handleRun} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg">Run Agent</Button>

            <div>
              <label className="block font-semibold mb-1 text-base">Output</label>
              <Textarea
                rows={10}
                readOnly
                value={outputText}
                placeholder={selectedAgent.outputPlaceholder}
                className="bg-gray-100 text-lg"
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
