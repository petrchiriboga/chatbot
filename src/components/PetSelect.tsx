'use client';

import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types/pet';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PetSelectProps {
  value?: string;
  onChange?: (petId: string) => void;
  className?: string;
}

export default function PetSelect({ value, onChange, className = '' }: PetSelectProps) {
  const { pets, loading, error } = usePets();

  if (loading) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        Loading pets...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 dark:text-red-400 ${className}`}>
        Error loading pets: {error}
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        No pets found
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor="pet-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Your Pet
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a pet..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Customer&apos;s Pets</SelectLabel>
            {pets.map((pet: Pet) => (
              <SelectItem key={pet.key} value={pet.key}>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Image
                      className="rounded-full"
                      src={pet.photo || '/placeholder-pet.svg'}
                      width={30}
                      height={30}
                      alt={pet.name}
                    />
                  </div>
                  <div className="flex-1">
                    {pet.name} ({pet.petType})
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Other Options</SelectLabel>
            <SelectItem value="unspecified">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full"
                    src="/placeholder-pet.svg"
                    width={30}
                    height={30}
                    alt="Unspecified"
                  />
                </div>
                <div className="flex-1">Unspecified</div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
