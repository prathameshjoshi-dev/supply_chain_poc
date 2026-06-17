import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateShipmentMutation } from '../api/shipmentsApi';
import { Layout } from '../../../components/layout/Layout';

export const CreateShipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [createShipment, { isLoading }] = useCreateShipmentMutation();

  const [formData, setFormData] = useState({
    priority: 'Medium',
    type: 'Standard',
    origin: '',
    destination: '',
    carrier: 'Global Freight Systems',
    serviceLevel: 'Standard',
    weight: 0,
    quantity: 1,
    packagingType: 'Palletized',
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    description: ''
  });

  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async () => {
    try {
      await createShipment(formData).unwrap();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/shipments');
      }, 3000);
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const handleDimensionChange = (field: 'length' | 'width' | 'height', value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }));
  };

  const baseRate = 1240.00;
  const fuelSurcharge = 85.50;
  const total = baseRate + fuelSurcharge;

  return (
    <Layout pageTitle="New Shipment">
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar bg-background p-margin-desktop">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-10 w-full pt-8 px-8">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
            <span>Shipments</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-medium">New Shipment</span>
          </nav>
          
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Create New Shipment</h2>
              <p className="text-on-surface-variant max-w-xl">Configure origin, destination, and cargo specifications for global dispatch. Data validation is performed in real-time.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/shipments')}
                className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-highest transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-bold hover:brightness-110 shadow-lg shadow-primary-container/20 transition-all active:scale-95 flex items-center gap-2"
              >
                {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : null}
                Create Shipment
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full px-8 grid grid-cols-12 gap-gutter">
          {/* Left Column: The Wizard/Form */}
          <div className="col-span-12 lg:col-span-8 space-y-8 pb-12">
            
            {/* Section 1: Shipment Details */}
            <section className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">1. Shipment Details</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical" className="text-status-critical font-bold">Critical</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Shipment Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Standard', 'Express', 'Hazardous'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setFormData({...formData, type})}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${formData.type === type ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline'}`}
                      >
                        <span className={`material-symbols-outlined ${formData.type === type ? 'text-primary' : type === 'Hazardous' ? 'text-status-warning' : 'text-on-surface-variant'}`}>
                          {type === 'Standard' ? 'deployed_code' : type === 'Express' ? 'bolt' : 'warning'}
                        </span>
                        <span className={`text-sm font-medium ${formData.type === type ? 'text-primary' : 'text-on-surface-variant'}`}>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Origin & Destination */}
            <section className="glass-card rounded-xl p-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">distance</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">2. Origin &amp; Destination</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                <div className="space-y-4">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Origin Port/City</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">location_on</span>
                    <input 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="Search Shanghai, Hamburg..." 
                      type="text"
                    />
                  </div>
                </div>
                
                <div className="hidden md:flex absolute left-1/2 top-[58px] -translate-x-1/2 items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-background border border-outline-variant flex items-center justify-center text-primary-container z-10">
                    <span className="material-symbols-outlined text-sm">east</span>
                  </div>
                  <div className="w-24 h-[1px] bg-dashed bg-[radial-gradient(circle_at_center,#3d494a_0.5px,transparent_1px)] bg-[length:6px_1px] absolute"></div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Destination Port/City</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">flag</span>
                    <input 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="Search Los Angeles, Rotterdam..." 
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Carrier & Service */}
            <section className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">3. Logistics Provider</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Preferred Carrier</label>
                  <select 
                    value={formData.carrier}
                    onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Apex Logistics">Apex Logistics</option>
                    <option value="Global Freight Systems">Global Freight Systems</option>
                    <option value="QuickShip Inc.">QuickShip Inc.</option>
                    <option value="Maersk Ocean">Maersk Ocean</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Service Level</label>
                  <div className="flex p-1 bg-surface-container-lowest rounded-xl border border-outline-variant">
                    {['Standard', 'Next Day', 'Economy'].map((level) => (
                      <button 
                        key={level}
                        onClick={() => setFormData({...formData, serviceLevel: level})}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${formData.serviceLevel === level ? 'text-on-primary-container bg-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Cargo Information */}
            <section className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">package_2</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">4. Cargo Information</h3>
              </div>
              
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Total Weight (kg)</label>
                  <input 
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Quantity (Items)</label>
                  <input 
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                    placeholder="1" 
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Packaging Type</label>
                  <select 
                    value={formData.packagingType}
                    onChange={(e) => setFormData({...formData, packagingType: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Palletized">Palletized</option>
                    <option value="Container">Container</option>
                    <option value="Loose Carton">Loose Carton</option>
                  </select>
                </div>
                
                <div className="col-span-12">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Dimensions (L x W x H cm)</label>
                  <div className="flex gap-4">
                    <input 
                      type="number"
                      value={formData.dimensions.length || ''}
                      onChange={(e) => handleDimensionChange('length', Number(e.target.value))}
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="Length" 
                    />
                    <div className="flex items-center text-outline-variant">×</div>
                    <input 
                      type="number"
                      value={formData.dimensions.width || ''}
                      onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="Width" 
                    />
                    <div className="flex items-center text-outline-variant">×</div>
                    <input 
                      type="number"
                      value={formData.dimensions.height || ''}
                      onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="Height" 
                    />
                  </div>
                </div>
                
                <div className="col-span-12">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Cargo Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-on-surface resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                    placeholder="Specify contents, handling instructions, or special requirements..." 
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Summary & Insights */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="glass-card rounded-xl overflow-hidden sticky top-8">
              <div className="p-6 bg-primary/10 border-b border-primary/20">
                <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Configuration Summary</h4>
                <p className="text-xs text-on-surface-variant">Real-time quote estimation</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Estimated Transit</span>
                  <span className="font-semibold text-on-surface">{formData.serviceLevel === 'Next Day' ? '1 Day' : formData.serviceLevel === 'Economy' ? '14 - 18 Days' : '5 - 7 Days'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Carrier Reliability</span>
                  <div className="flex gap-1 text-status-success">
                    <span className="material-symbols-outlined text-xs fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-xs fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-xs fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-xs fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-xs">star</span>
                  </div>
                </div>
                <div className="h-[1px] bg-outline-variant"></div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">Base Rate</span>
                    <span className="font-mono-md text-on-surface">${baseRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">Fuel Surcharge</span>
                    <span className="font-mono-md text-on-surface">${fuelSurcharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-outline-variant">
                    <span className="font-bold text-on-surface">TOTAL EST.</span>
                    <span className="text-headline-md font-headline-md text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-surface-container-highest/50 rounded-lg p-4 border border-outline-variant/30">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-status-warning">bolt</span>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      <strong className="text-on-surface">AI Optimizing:</strong> We've found a route via Long Beach that could save you <span className="text-status-success">$120</span> and 2 days. 
                      <a className="text-primary underline block mt-1" href="#">Review Suggestion</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <div className={`fixed bottom-10 right-10 transition-all duration-500 z-[100] ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-surface-container-high border border-status-success/30 rounded-xl p-4 flex items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center text-status-success">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="font-bold text-on-surface">Shipment Created</p>
            <p className="text-xs text-on-surface-variant">The shipment has been queued for dispatch.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
