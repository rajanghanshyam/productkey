import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { format, addDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

const RenewalCalendar: React.FC = () => {
  const { productKeys, customers, allocations } = useAppContext();
  
  const upcomingRenewals = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    
    return productKeys
      .filter(key => {
        if (!key.expiresAt) return false;
        const expiryDate = new Date(key.expiresAt);
        return isWithinInterval(expiryDate, { start: today, end: thirtyDaysFromNow });
      })
      .map(key => {
        const allocation = allocations.find(a => a.productKeyId === key.id);
        const customer = allocation ? customers.find(c => c.id === allocation.customerId) : null;
        return {
          ...key,
          customer,
          expiryDate: new Date(key.expiresAt!),
        };
      })
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
  }, [productKeys, customers, allocations]);
  
  const handleWhatsAppNotify = (customer: any, key: any) => {
    const message = `Hello ${customer.name}, your product key ${key.key} will expire on ${format(key.expiryDate, 'MMMM dd, yyyy')}. Please contact us for renewal.`;
    const whatsappUrl = `https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Renewal Calendar</h3>
        </div>
        {upcomingRenewals.length > 0 && (
          <span className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {upcomingRenewals.length} upcoming
          </span>
        )}
      </div>
      
      {upcomingRenewals.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No upcoming renewals in the next 30 days</p>
      ) : (
        <div className="space-y-4">
          {upcomingRenewals.map(renewal => (
            <div 
              key={renewal.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">
                    {renewal.customer?.name || 'Unassigned Key'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Key: {renewal.key}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Expires: {format(renewal.expiryDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
                
                {renewal.customer?.phone && (
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppNotify(renewal.customer, renewal)}
                    className="flex items-center"
                  >
                    Notify via WhatsApp
                  </Button>
                )}
              </div>
              
              {isSameDay(renewal.expiryDate, new Date()) && (
                <div className="mt-2 flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Expires today!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenewalCalendar;