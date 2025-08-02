"use client";
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($createProjectDto: CreateProjectDto!) {
    createProject(createProjectDto: $createProjectDto) {
      publicId
      name
    }
  }
`;

export function CreateProjectDialog({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const [createProject, { loading }] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: () => {
      // ИЗМЕНЕНИЕ 3: Вызываем toast.success()
      toast.success("Успех!", {
        description: `Проект "${name}" был создан.`
      });
      setOpen(false);
      setName('');
      onProjectCreated();
    },
    onError: (error) => {
      // ИЗМЕНЕНИЕ 4: Вызываем toast.error()
      toast.error("Ошибка!", {
        description: error.message
      });
    },
  });

  const handleSubmit = () => {
    if (!name) return;
    createProject({ variables: { createProjectDto: { name } } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Создать проект</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новый проект</DialogTitle>
          <DialogDescription>
            Дайте вашему проекту имя. Вы сможете изменить его позже.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}