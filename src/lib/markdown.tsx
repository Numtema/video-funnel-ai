import React from 'react';

/**
 * Simple markdown renderer for funnel content
 * Handles: **bold**, *italic*, line breaks, and cleans up excessive formatting
 */
export function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Clean up PROFIL patterns and excessive formatting
  let cleaned = text
    // Remove "PROFIL X – " patterns
    .replace(/(?:🌟|✨|🔁|🦋|💫|⭐)?\s*PROFIL\s*\d+\s*[–-]\s*/gi, '')
    // Clean up excessive emoji sequences (more than 2 in a row)
    .replace(/([\u{1F300}-\u{1F9FF}][\u{FE0F}\u{200D}]*){3,}/gu, '')
    // Normalize multiple line breaks
    .replace(/\n{3,}/g, '\n\n');

  // Split by line breaks first
  const lines = cleaned.split('\n');
  
  return lines.map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;

    // Process bold (**text** or __text__)
    const boldRegex = /\*\*([^*]+)\*\*|__([^_]+)__/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = line.slice(lastIndex, match.index);
        parts.push(...processItalics(beforeText, `${lineIndex}-${keyIndex++}`));
      }
      
      // Add bold text
      const boldText = match[1] || match[2];
      parts.push(
        <strong key={`${lineIndex}-bold-${keyIndex++}`} className="font-semibold">
          {boldText}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last match
    if (lastIndex < line.length) {
      parts.push(...processItalics(line.slice(lastIndex), `${lineIndex}-${keyIndex++}`));
    }

    // If no matches, process italics on the whole line
    if (parts.length === 0) {
      parts.push(...processItalics(line, `${lineIndex}-${keyIndex++}`));
    }

    // Return line with break if not last
    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function processItalics(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const italicRegex = /\*([^*]+)\*|_([^_]+)_/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = italicRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${keyPrefix}-text-${keyIndex++}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add italic text
    const italicText = match[1] || match[2];
    parts.push(
      <em key={`${keyPrefix}-italic-${keyIndex++}`} className="italic">
        {italicText}
      </em>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`${keyPrefix}-rest-${keyIndex++}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  // If no matches, return original text
  if (parts.length === 0) {
    parts.push(<span key={`${keyPrefix}-plain`}>{text}</span>);
  }

  return parts;
}

/**
 * Clean profile title - removes profile numbering and excessive emojis
 */
export function cleanProfileTitle(title: string): string {
  return title
    // Remove "PROFIL X – " patterns
    .replace(/(?:🌟|✨|🔁|🦋|💫|⭐)?\s*PROFIL\s*\d+\s*[–-]\s*/gi, '')
    // Clean up leading/trailing emojis
    .replace(/^[\u{1F300}-\u{1F9FF}\s]+/gu, '')
    .trim();
}
