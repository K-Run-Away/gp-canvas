'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { searchMedications, Medication } from '../services/dmd';
import { searchConditions, Condition } from '../services/conditions';

export default function Home() {
  const [adultSearchTerm, setAdultSearchTerm] = useState('');
  const [childSearchTerm, setChildSearchTerm] = useState('');
  const [interactionSearchTerm, setInteractionSearchTerm] = useState('');
  const [cksSearchTerm, setCksSearchTerm] = useState('');
  
  const [adultSuggestions, setAdultSuggestions] = useState<Medication[]>([]);
  const [childSuggestions, setChildSuggestions] = useState<Medication[]>([]);
  const [interactionSuggestions, setInteractionSuggestions] = useState<Medication[]>([]);
  const [cksSuggestions, setCksSuggestions] = useState<Condition[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeSuggestionList, setActiveSuggestionList] = useState<'adult' | 'child' | 'interaction' | 'cks' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [adultSuggestions, childSuggestions, interactionSuggestions, cksSuggestions]);

  // Update suggestions as user types - with debounce for medications API
  useEffect(() => {
    const fetchAdultMedications = async () => {
      if (adultSearchTerm.trim().length < 2) {
        setAdultSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await searchMedications(adultSearchTerm);
        setAdultSuggestions(results);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setAdultSuggestions([]);
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchAdultMedications, 300);
    return () => clearTimeout(timeoutId);
  }, [adultSearchTerm]);

  // Update child medication suggestions
  useEffect(() => {
    const fetchChildMedications = async () => {
      if (childSearchTerm.trim().length < 2) {
        setChildSuggestions([]);
        return;
      }
      
      try {
        const results = await searchMedications(childSearchTerm);
        setChildSuggestions(results);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setChildSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchChildMedications, 300);
    return () => clearTimeout(timeoutId);
  }, [childSearchTerm]);

  // Update interaction medication suggestions
  useEffect(() => {
    const fetchInteractionMedications = async () => {
      if (interactionSearchTerm.trim().length < 2) {
        setInteractionSuggestions([]);
        return;
      }
      
      try {
        const results = await searchMedications(interactionSearchTerm);
        setInteractionSuggestions(results);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setInteractionSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchInteractionMedications, 300);
    return () => clearTimeout(timeoutId);
  }, [interactionSearchTerm]);

  // Update CKS suggestions
  useEffect(() => {
    const fetchConditions = async () => {
      if (cksSearchTerm.trim().length < 2) {
        setCksSuggestions([]);
        return;
      }
      
      try {
        const results = await searchConditions(cksSearchTerm);
        setCksSuggestions(results);
      } catch (error) {
        console.error('Error fetching conditions:', error);
        setCksSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchConditions, 300);
    return () => clearTimeout(timeoutId);
  }, [cksSearchTerm]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: 'adult' | 'child' | 'interaction' | 'cks') => {
    const suggestions = type === 'adult' ? adultSuggestions 
                     : type === 'child' ? childSuggestions 
                     : type === 'interaction' ? interactionSuggestions
                     : cksSuggestions;

    setActiveSuggestionList(type);

    if (suggestions.length === 0) return;

    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    // Enter
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      if (selected) {
        if (type === 'adult') {
          setAdultSearchTerm(selected.display);
          const bnfUrl = `https://bnf.nice.org.uk/drugs/${selected.search}/#indications-and-dose`;
          window.open(bnfUrl, '_blank');
          setAdultSearchTerm('');
          setAdultSuggestions([]);
        } else if (type === 'child') {
          setChildSearchTerm(selected.display);
          const bnfcUrl = `https://bnfc.nice.org.uk/drugs/${selected.search}/#indications-and-dose`;
          window.open(bnfcUrl, '_blank');
          setChildSearchTerm('');
          setChildSuggestions([]);
        } else if (type === 'interaction') {
          setInteractionSearchTerm(selected.display);
          const interactionUrl = `https://bnfc.nice.org.uk/interactions/${selected.search}/`;
          window.open(interactionUrl, '_blank');
          setInteractionSearchTerm('');
          setInteractionSuggestions([]);
        } else {
          setCksSearchTerm(selected.display);
          const cksUrl = `https://cks.nice.org.uk/topics/${selected.search}/management/`;
          window.open(cksUrl, '_blank');
          setCksSearchTerm('');
          setCksSuggestions([]);
        }
        setSelectedIndex(-1);
      }
    }
  };

  const handleAdultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adultSearchTerm.trim()) return;

    const match = adultSuggestions.find(
      med => med.display.toLowerCase() === adultSearchTerm.toLowerCase() ||
             med.search.toLowerCase() === adultSearchTerm.toLowerCase()
    );

    const formattedSearch = match ? match.search : adultSearchTerm.trim().toLowerCase().replace(/\s+/g, '-');
    const bnfUrl = `https://bnf.nice.org.uk/drugs/${formattedSearch}/#indications-and-dose`;
    window.open(bnfUrl, '_blank');
    setSelectedIndex(-1);
    setAdultSearchTerm('');
    setAdultSuggestions([]);
  };

  const handleChildSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childSearchTerm.trim()) return;

    const match = childSuggestions.find(
      med => med.display.toLowerCase() === childSearchTerm.toLowerCase() ||
             med.search.toLowerCase() === childSearchTerm.toLowerCase()
    );

    const formattedSearch = match ? match.search : childSearchTerm.trim().toLowerCase().replace(/\s+/g, '-');
    const bnfcUrl = `https://bnfc.nice.org.uk/drugs/${formattedSearch}/#indications-and-dose`;
    window.open(bnfcUrl, '_blank');
    setSelectedIndex(-1);
    setChildSearchTerm('');
    setChildSuggestions([]);
  };

  const handleInteractionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactionSearchTerm.trim()) return;

    const match = interactionSuggestions.find(
      med => med.display.toLowerCase() === interactionSearchTerm.toLowerCase() ||
             med.search.toLowerCase() === interactionSearchTerm.toLowerCase()
    );

    const formattedSearch = match ? match.search : interactionSearchTerm.trim().toLowerCase().replace(/\s+/g, '-');
    const interactionUrl = `https://bnfc.nice.org.uk/interactions/${formattedSearch}/`;
    window.open(interactionUrl, '_blank');
    setSelectedIndex(-1);
    setInteractionSearchTerm('');
    setInteractionSuggestions([]);
  };

  const handleCksSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cksSearchTerm.trim()) return;

    const match = cksSuggestions.find(
      cond => cond.display.toLowerCase() === cksSearchTerm.toLowerCase() ||
              cond.search.toLowerCase() === cksSearchTerm.toLowerCase()
    );

    const formattedSearch = match ? match.search : cksSearchTerm.trim().toLowerCase().replace(/\s+/g, '-');
    const cksUrl = `https://cks.nice.org.uk/topics/${formattedSearch}/management/`;
    window.open(cksUrl, '_blank');
    setSelectedIndex(-1);
    setCksSearchTerm('');
    setCksSuggestions([]);
  };

  const renderSuggestions = (suggestions: Medication[] | Condition[], onSelect: (value: string) => void, type: 'adult' | 'child' | 'interaction' | 'cks') => {
    if (suggestions.length === 0) return null;

    return (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
        {suggestions.map((item: Medication | Condition, index: number) => (
          <li
            key={index}
            className={`px-4 py-3 cursor-pointer text-sm ${
              index === selectedIndex && type === activeSuggestionList
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            } transition-colors duration-150`}
            onClick={() => {
              onSelect(item.display);
              if (type === 'adult') {
                const bnfUrl = `https://bnf.nice.org.uk/drugs/${item.search}/#indications-and-dose`;
                window.open(bnfUrl, '_blank');
                setAdultSearchTerm('');
                setAdultSuggestions([]);
              } else if (type === 'child') {
                const bnfcUrl = `https://bnfc.nice.org.uk/drugs/${item.search}/#indications-and-dose`;
                window.open(bnfcUrl, '_blank');
                setChildSearchTerm('');
                setChildSuggestions([]);
              } else if (type === 'interaction') {
                const interactionUrl = `https://bnfc.nice.org.uk/interactions/${item.search}/`;
                window.open(interactionUrl, '_blank');
                setInteractionSearchTerm('');
                setInteractionSuggestions([]);
              } else {
                const cksUrl = `https://cks.nice.org.uk/topics/${item.search}/management/`;
                window.open(cksUrl, '_blank');
                setCksSearchTerm('');
                setCksSuggestions([]);
              }
              setSelectedIndex(-1);
            }}
          >
            {item.display}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">GP Canvas</h1>
          <p className="text-lg text-gray-600 mb-2">In the consultation, <span className="line-through">minutes</span> seconds matter.</p>
          <div className="flex flex-col gap-1 text-gray-500 text-sm">
            <p>Search medication <span className="text-blue-500">→</span> Indications and Doses BNF</p>
            <p>Search condition <span className="text-purple-500">→</span> Management in NICE CKS</p>
          </div>
        </div>

        {/* Adult BNF Search */}
        <form onSubmit={handleAdultSearch} className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adult BNF
          </label>
          <div className="rounded-lg shadow-sm relative">
            <input
              type="text"
              value={adultSearchTerm}
              onChange={(e) => setAdultSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'adult')}
              placeholder="Search adult medications..."
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              autoFocus
            />
            {renderSuggestions(adultSuggestions, (value) => setAdultSearchTerm(value), 'adult')}
          </div>
          <button
            type="submit"
            className="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Search BNF
          </button>
        </form>

        {/* Children's BNF Search */}
        <form onSubmit={handleChildSearch} className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children BNF
          </label>
          <div className="rounded-lg shadow-sm relative">
            <input
              type="text"
              value={childSearchTerm}
              onChange={(e) => setChildSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'child')}
              placeholder="Search children's medications..."
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-200"
            />
            {renderSuggestions(childSuggestions, (value) => setChildSearchTerm(value), 'child')}
          </div>
          <button
            type="submit"
            className="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Search BNFc
          </button>
        </form>

        {/* Interactions Search */}
        <form onSubmit={handleInteractionSearch} className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interactions BNF
          </label>
          <div className="rounded-lg shadow-sm relative">
            <input
              type="text"
              value={interactionSearchTerm}
              onChange={(e) => setInteractionSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'interaction')}
              placeholder="Search medication interactions..."
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all duration-200"
            />
            {renderSuggestions(interactionSuggestions, (value) => setInteractionSearchTerm(value), 'interaction')}
          </div>
          <button
            type="submit"
            className="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            Search Interactions
          </button>
        </form>

        {/* CKS Search */}
        <form onSubmit={handleCksSearch} className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NICE CKS
          </label>
          <div className="rounded-lg shadow-sm relative">
            <input
              type="text"
              value={cksSearchTerm}
              onChange={(e) => setCksSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'cks')}
              placeholder="Search conditions (e.g. gout, migraine)..."
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
            />
            {renderSuggestions(cksSuggestions, (value) => setCksSearchTerm(value), 'cks')}
          </div>
          <button
            type="submit"
            className="mt-3 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            Search CKS
          </button>
        </form>

        <div className="mt-12 space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <p className="text-center text-sm text-yellow-800">
              Important: BNF and CKS access is only available in the UK (England, Scotland, Wales and Northern Ireland). 
              If you are outside the UK, you will need a MedicinesComplete subscription to access BNF content, and CKS content is not accessible.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-center text-sm text-gray-600">
              Please check the webpage you are taken to is correct. We do not accept any clinical responsibility.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 