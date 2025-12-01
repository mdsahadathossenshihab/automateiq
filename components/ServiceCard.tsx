import React from 'react';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-200 relative overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      <div className="mb-6 bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300 border border-slate-100 group-hover:border-blue-100">
        <div className="transform group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">{service.title}</h3>
      <p className="text-slate-600 leading-relaxed mb-8 flex-1">
        {service.description}
      </p>
      
      <button className="flex items-center text-slate-900 font-bold group-hover:text-blue-600 group-hover:gap-3 gap-2 transition-all duration-300 mt-auto">
        বিস্তারিত জানুন <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default ServiceCard;