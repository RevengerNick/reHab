"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Copy } from 'lucide-react';

export function ProjectCard({ project }: { project: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Сбрасываем состояние через 2 секунды
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.publicId}</CardDescription>
        <CardDescription>
          Создан: {new Date(project.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">API-ключ</p>
        <div className="mt-2 flex items-center gap-2">
          <Input type="text" readOnly value={project.apiKey} className="font-mono" />
          <Button size="icon" variant="ghost" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {copied && <p className="mt-2 text-xs text-green-600">Скопировано!</p>}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline">
          <Link href={`/projects/${project.publicId}/logs`}>
            <LogIn className="mr-2 h-4 w-4" /> Логи
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.publicId}/settings`}>Настроить каналы</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// "Скелетон" для имитации загрузки
export function ProjectCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-3/4 rounded bg-slate-200"></div>
        <div className="mt-2 h-4 w-1/2 rounded bg-slate-200"></div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-1/4 rounded bg-slate-200"></div>
        <div className="mt-2 h-10 w-full rounded bg-slate-200"></div>
      </CardContent>
    </Card>
  );
}