import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Search, X } from "lucide-react";
import { apiRequest } from '@/lib/queryClient';

interface RequestSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function RequestSearch({ onSearch, placeholder = "Search requests...", className = "" }: RequestSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }

    // @ts-ignore - SpeechRecognition is not in the typescript types
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      
      // Submit the search
      onSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch(''); // Clear the search
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          className="bg-gray-800 border-gray-700 text-white pr-16"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={startVoiceSearch}
            className={`p-1 mr-1 rounded-full ${isListening ? 'text-[#ff3a3a]' : 'text-gray-400 hover:text-white'}`}
          >
            <Mic className="h-4 w-4" />
          </button>
          
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1 mr-1 rounded-full text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <Search className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </form>
    </div>
  );
}