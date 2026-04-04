'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Award, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { listedProfessionals } from '@/lib/public-data';

const PAGE_SIZE = 20;

export default function ProfessionalsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const roles = Array.from(new Set(listedProfessionals.map((p) => p.role)));
  const locations = Array.from(new Set(listedProfessionals.map((p) => p.location)));

  const filtered = listedProfessionals.filter((prof) => {
    const matchesSearch =
      searchQuery === '' ||
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === '' || prof.role === selectedRole;
    const matchesLocation = selectedLocation === '' || prof.location === selectedLocation;

    return matchesSearch && matchesRole && matchesLocation;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/directory" className="text-primary hover:underline text-sm mb-2 inline-block">
                &larr; Back to Directory
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Care Professionals Directory</h1>
              <p className="mt-2 text-gray-600">Find verified nurses, care workers, and support professionals</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{filtered.length}</p>
              <p className="text-sm text-gray-600">professionals</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={selectedRole}
                  onChange={handleFilterChange(setSelectedRole)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={handleFilterChange(setSelectedLocation)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedRole || selectedLocation) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    Search: {searchQuery}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {selectedRole && (
                  <button
                    onClick={() => setSelectedRole('')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {selectedRole}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {selectedLocation && (
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {selectedLocation}
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-600">No professionals found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            paginated.map((prof) => (
              <div key={prof.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                      {prof.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{prof.name}</h3>
                        {prof.verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{prof.role}</p>
                      {prof.band && <p className="text-xs text-gray-500">{prof.band}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-900">{prof.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{prof.shiftsCompleted} shifts</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">{prof.location}</p>
                      <p className="text-xs text-gray-500">{prof.yearsExperience} years exp.</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Rate</p>
                    <p className="text-gray-900 font-medium">£{prof.hourlyRate.min}-£{prof.hourlyRate.max}/hr</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Availability</p>
                    <p className="text-gray-900 font-medium">{prof.availability}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Verifications</p>
                    <p className="text-xs text-green-600">
                      {prof.nmcVerified ? '✓ NMC' : ''} {prof.dbsVerified ? '✓ DBS' : ''}
                    </p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {prof.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  View Profile & Book
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} &middot; {filtered.length} professionals
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
