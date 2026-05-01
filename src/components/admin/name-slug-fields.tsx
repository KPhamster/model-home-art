"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface NameSlugFieldsProps {
  nameId: string;
  slugId: string;
  namePlaceholder?: string;
  slugPlaceholder?: string;
}

export function NameSlugFields({
  nameId,
  slugId,
  namePlaceholder,
  slugPlaceholder,
}: NameSlugFieldsProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setSlug(slugify(value));
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          id={nameId}
          name="name"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          placeholder={namePlaceholder}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={slugId}>Slug</Label>
        <Input
          id={slugId}
          name="slug"
          value={slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          placeholder={slugPlaceholder}
        />
      </div>
    </>
  );
}
