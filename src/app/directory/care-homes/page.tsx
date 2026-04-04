'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Bed, Award, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { listedCareHomes } from '@/lib/public-data';

const PAGE_SIZE = 20;

export default function CareHomesDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const locations = Array.from(new Set(listedCareHomes.map((home) => home.location)));
  const ratings = ['Outstanding', 'Good', 'Requires Improvement', 'Inadequate'];

  const filtered = listedCareHomes.filter((home) => {
    const matchesSearch =
      searchQuery === '' ||
      home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      home.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocation === '' || home.location === selectedLocation;
    const matchesRating = selectedRating === '' || home.cqcRating === selectedRating;

    return matchesSearch && matchesLocation && matchesRating;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Outstanding':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Requires Improvement':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inadequate':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Care Homes Directory</h1>
              <p className="mt-2 text-gray-600">Find verified care homes across the UK</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{filtered.length}</p>
              <p className="text-sm text-gray-600">care homes</p>
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
                placeholder="Search care homes by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CQC Rating</label>
                <select
                  value={selectedRating}
                  onChange={handleFilterChange(setSelectedRating)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All ratings</option>
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedLocation || selectedRating) && (
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
                {selectedLocation && (
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {selectedLocation}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {selectedRating && (
                  <button
                    onClick={() => setSelectedRating('')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {selectedRating}
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Care Homes Grid */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-600">No care homes found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            paginated.map((home) => (
              <div key={home.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{home.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{home.type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(home.cqcRating)}`}>
                    {home.cqcRating}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">{home.location}</p>
                      <p className="text-xs text-gray-500">{home.postcode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">{home.beds}</p>
                      <p className="text-xs text-gray-500">beds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">{home.shiftsPosted}</p>
                      <p className="text-xs text-gray-500">shifts posted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">£{home.avgRate}/hr</p>
                      <p className="text-xs text-gray-500">avg. rate</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {home.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{home.phone}</p>

                {expandedId === home.id && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3 border-t border-gray-200 pt-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Full Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Name:</strong> {home.name}</p>
                        <p><strong>Type:</strong> {home.type}</p>
                        <p><strong>Location:</strong> {home.location}, {home.postcode}</p>
                        <p><strong>Beds:</strong> {home.beds}</p>
                        <p><strong>Phone:</strong> {home.phone}</p>
                        <p><strong>Average Rate:</strong> £{home.avgRate}/hour</p>
                        <p><strong>Recent Shifts Posted:</strong> {home.shiftsPosted}</p>
                        <p><strong>All Specialties:</strong> {home.specialties.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === home.id ? null : home.id)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {expandedId === home.id ? 'Hide Details' : 'View Details'}
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
              Page {currentPage} of {totalPages} &middot; {filtered.length} care homes
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
