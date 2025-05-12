// Updated version with search, folder icons, and style improvements
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Agent type
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
  // ... all other agents here ...
];


export default function MyGent() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [outputText, setOutputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(filteredAgents.map(agent => agent.category))];

  return (
    <div className="grid grid-cols-12 h-screen font-inter bg-gradient-to-br from-gray-100 to-gray-50 pt-12">
      <div className="col-span-2 bg-gray-500 text-white p-4 border-r overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
          <h1 className="text-xl font-bold">MyGent</h1>
        </div>
        <Input
          placeholder="Search agents..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="mb-4 bg-white text-black"
        />
        {categories.map(cat => (
          <details key={cat} className="mb-4">
            <summary className="flex items-center gap-2 text-lg font-semibold cursor-pointer select-none py-1">
              <Folder className="w-4 h-4" /> {cat}
            </summary>
            <div className="ml-3 mt-2 space-y-2">
              {filteredAgents.filter(agent => agent.category === cat).map(agent => (
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
        {/* existing agent interface unchanged */}
        {/* keep the content of agent selection and output logic here as is */}
      </motion.div>
    </div>
  );
}
