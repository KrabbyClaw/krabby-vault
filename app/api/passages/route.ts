import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface PassageFrontmatter {
  title: string;
  level: number;
  shell: string;
  status: string;
  icon: string;
}

interface Passage {
  id: string;
  frontmatter: PassageFrontmatter;
  content: string;
}

function parseFrontmatter(content: string): { frontmatter: PassageFrontmatter; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: { title: '', level: 0, shell: '', status: '', icon: '' },
      body: content
    };
  }
  
  const frontmatterText = match[1];
  const body = match[2].trim();
  
  const frontmatter: PassageFrontmatter = {
    title: '',
    level: 0,
    shell: '',
    status: '',
    icon: ''
  };
  
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      const trimmedKey = key.trim() as keyof PassageFrontmatter;
      if (trimmedKey === 'level') {
        (frontmatter as any)[trimmedKey] = parseInt(value);
      } else if (trimmedKey in frontmatter) {
        (frontmatter as any)[trimmedKey] = value;
      }
    }
  });
  
  return { frontmatter, body };
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.+)$/gm, '<h3 class="text-purple-300 font-semibold mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-200 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-100 mb-4">$1</h1>')
    .replace(/^\*\*(.+?)\*\*$/gm, '<strong class="text-slate-300">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.+)$/gm, '<li class="text-slate-400">$1</li>')
    .replace(/^(<li.+<\/li>\n)+/gm, '<ul class="list-disc list-inside text-slate-400 mb-4 space-y-1">$&</ul>')
    .replace(/^_(.+)_$/gm, '<p class="text-slate-400 italic mb-4">$1</p>')
    .replace(/\n\n/g, '</p><p class="text-slate-400 mb-4">')
    .replace(/^([^<].+[^>])$/gm, '<p class="text-slate-400 mb-4">$1</p>');
}

export async function GET() {
  try {
    const passagesDir = path.join(process.cwd(), 'passages');
    const files = await fs.readdir(passagesDir);
    
    const passages: Passage[] = [];
    
    for (const file of files.sort()) {
      if (file.endsWith('.md')) {
        const filePath = path.join(passagesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        
        passages.push({
          id: file.replace('.md', ''),
          frontmatter,
          content: markdownToHtml(body)
        });
      }
    }
    
    return NextResponse.json({ passages });
  } catch (error) {
    console.error('Error loading passages:', error);
    return NextResponse.json({ passages: [] }, { status: 500 });
  }
}