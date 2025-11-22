import React, { useState, useMemo } from 'react';
import { hospitalData } from '../../data/hospitalData.ts';
import Icon from '../shared/Icon.tsx';

const NetworkHospital: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const hospitalsPerPage = 10;

    // Get unique areas for filter
    const uniqueAreas = useMemo(() => {
        const areas = hospitalData.map(hospital => hospital.area);
        return ['All Areas', ...Array.from(new Set(areas)).sort()];
    }, []);

    // Filter hospitals based on search term and selected area
    const filteredHospitals = useMemo(() => {
        return hospitalData.filter(hospital => {
            const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                hospital.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesArea = selectedArea === '' || selectedArea === 'All Areas' || hospital.area === selectedArea;
            return matchesSearch && matchesArea;
        });
    }, [searchTerm, selectedArea]);

    // Pagination
    const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);
    const startIndex = (currentPage - 1) * hospitalsPerPage;
    const endIndex = startIndex + hospitalsPerPage;
    const currentHospitals = filteredHospitals.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedArea]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section id="networkhospital" className="hidden md:block py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Our Network Hospitals</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-body">Find a hospital near you from our extensive network of {hospitalData.length} partner hospitals across Bangladesh.</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search hospitals, areas, or addresses..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                            />
                        </div>

                        {/* Area Filter */}
                        <div className="relative">
                            <select
                                value={selectedArea}
                                onChange={handleAreaChange}
                                aria-label="Filter hospitals by area"
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white"
                            >
                                {uniqueAreas.map(area => (
                                    <option key={area} value={area === 'All Areas' ? '' : area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredHospitals.length} of {hospitalData.length} hospitals
                        {searchTerm && ` for "${searchTerm}"`}
                        {selectedArea && selectedArea !== 'All Areas' && ` in ${selectedArea}`}
                    </div>
                </div>
                {/* Hospital Table */}
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-emerald-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold">#</th>
                                <th scope="col" className="px-6 py-4 font-bold">Area</th>
                                <th scope="col" className="px-6 py-4 font-bold">Hospital Name</th>
                                <th scope="col" className="px-6 py-4 font-bold">Address</th>
                                <th scope="col" className="px-6 py-4 font-bold">Facilities & Discounts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentHospitals.length > 0 ? (
                                currentHospitals.map(hospital => (
                                    <tr key={hospital.id} className="bg-white border-b hover:bg-emerald-50 transition-colors duration-200">
                                        <td className="px-6 py-4 font-medium text-emerald-600">{hospital.id}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                {hospital.area}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 mb-1">{hospital.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{hospital.address}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 leading-relaxed">
                                                {hospital.facility.split('*').filter(item => item.trim()).map((discount, index) => (
                                                    <div key={index} className="flex items-start mb-1">
                                                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span>{discount.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-12 h-12 text-gray-300 mb-2" />
                                            <p className="text-lg font-medium">No hospitals found</p>
                                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-lg px-6 py-4">
                        <div className="text-sm text-gray-700">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredHospitals.length)} of {filteredHospitals.length} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                }`}
                            >
                                <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-4 h-4" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === currentPage;
                                const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                                
                                if (!showPage) {
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="px-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                }
                                
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                            isCurrentPage
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                }`}
                            >
                                <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NetworkHospital;
