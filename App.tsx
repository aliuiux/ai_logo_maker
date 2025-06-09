import React, { useState } from 'react';
import './App.css';

// Type definitions
type LogoStyle = 'modern' | 'classic' | 'minimal' | 'fun' | 'handcrafted';
type Industry =
  | 'tech'
  | 'food'
  | 'health'
  | 'fashion'
  | 'finance'
  | 'education'
  | 'other';
type LayoutOption = 'stacked' | 'horizontal' | 'icon-only' | 'text-only';

interface LogoConcept {
  description: string;
  designPhilosophy?: string;
  colors?: string[];
  typography?: string[];
}

interface LogoOption {
  id: string;
  imageUrl: string;
  selected: boolean;
  concept?: LogoConcept;
}

interface LogoCustomization {
  color: string;
  layout: LayoutOption;
  typography: string;
}

const App: React.FC = () => {
  // Step states
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [logoStyles, setLogoStyles] = useState<LogoStyle[]>([]);
  const [logoOptions, setLogoOptions] = useState<LogoOption[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Customization state
  const [customization, setCustomization] = useState<LogoCustomization>({
    color: '#4f46e5',
    layout: 'stacked',
    typography: 'sans-serif',
  });

  // Industries data
  const industries = [
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'food', name: 'Food & Drink', icon: '🍔' },
    { id: 'health', name: 'Health & Wellness', icon: '🏥' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'other', name: 'Other', icon: '✨' },
  ];

  // Logo styles data
  const styleOptions = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Timeless and professional',
    },
    { id: 'minimal', name: 'Minimal', description: 'Simple and streamlined' },
    { id: 'fun', name: 'Fun', description: 'Playful and colorful' },
    {
      id: 'handcrafted',
      name: 'Handcrafted',
      description: 'Artistic and organic',
    },
  ];

  // Handle business name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName.trim()) {
      setStep(2);
    }
  };

  // Handle industry selection
  const handleIndustrySelect = (selectedIndustry: Industry) => {
    setIndustry(selectedIndustry);
    setStep(3);
  };

  // Handle logo style selection
  const handleStyleToggle = (style: LogoStyle) => {
    setLogoStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  // Generate logo options
  const generateLogos = () => {
    setIsGenerating(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      try {
        if (!businessName) throw new Error('Business name is required');

        const mockLogos = Array.from({ length: 6 }, (_, i) => ({
          id: `logo-${i}`,
          imageUrl: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
            businessName
          )}+Logo+${i + 1}`,
          selected: false,
          concept: {
            description: `${logoStyles.join(', ')} style logo concept ${i + 1}`,
            colors: ['#4f46e5', '#10b981'],
            typography: ['sans-serif', 'serif'],
          },
        }));

        setLogoOptions(mockLogos);
        setStep(4);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate logos'
        );
      } finally {
        setIsGenerating(false);
      }
    }, 2000);
  };

  // Select a logo option
  const handleLogoSelect = (id: string) => {
    setSelectedLogo(id);
    setLogoOptions((prev) =>
      prev.map((logo) => ({
        ...logo,
        selected: logo.id === id,
      }))
    );
  };

  // Handle download
  const handleDownload = (format: 'png' | 'svg') => {
    const selectedLogoData = logoOptions.find(
      (logo) => logo.id === selectedLogo
    );
    if (!selectedLogoData) {
      setError('No logo selected for download');
      return;
    }

    const link = document.createElement('a');
    link.href = selectedLogoData.imageUrl;
    link.download = `${businessName}-logo.${format}`;
    link.click();
  };

  // Color manipulation helper
  const getHueRotation = (hexColor: string): number => {
    // Simple implementation - consider using a color library for production
    const colorMap: Record<string, number> = {
      '#4f46e5': 0,
      '#10b981': 120,
      '#EF4444': 240,
      '#F59E0B': 60,
      '#7C3AED': 300,
    };
    return colorMap[hexColor] || 0;
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-container">
            <h1>What's your business name?</h1>
            <p>Enter your business name to get started</p>
            <form onSubmit={handleNameSubmit} className="name-form">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Zest Fission Inc"
                required
              />
              <button type="submit">Continue</button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <h1>What industry is your business in?</h1>
            <p>This helps us create the perfect logo for you</p>
            <div className="industry-grid">
              {industries.map((item) => (
                <button
                  key={item.id}
                  className={`industry-card ${
                    industry === item.id ? 'selected' : ''
                  }`}
                  onClick={() => handleIndustrySelect(item.id as Industry)}
                >
                  <span className="industry-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h1>What style do you prefer?</h1>
            <p>Select one or more styles that fit your brand</p>
            <div className="style-options">
              {styleOptions.map((style) => (
                <div
                  key={style.id}
                  className={`style-card ${
                    logoStyles.includes(style.id as LogoStyle) ? 'selected' : ''
                  }`}
                  onClick={() => handleStyleToggle(style.id as LogoStyle)}
                >
                  <h3>{style.name}</h3>
                  <p>{style.description}</p>
                </div>
              ))}
            </div>
            <button
              className="generate-button"
              onClick={generateLogos}
              disabled={logoStyles.length === 0}
            >
              Generate Logos
            </button>
          </div>
        );
      case 4:
        return (
          <div className="step-container">
            <h1>Choose Your Logo</h1>
            <p>Select your favorite design to customize</p>

            {error && <div className="error-message">{error}</div>}

            {isGenerating ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Generating your logo options...</p>
              </div>
            ) : (
              <>
                <div className="logo-grid">
                  {logoOptions.map((logo) => (
                    <div
                      key={logo.id}
                      className={`logo-card ${logo.selected ? 'selected' : ''}`}
                      onClick={() => handleLogoSelect(logo.id)}
                    >
                      <img src={logo.imageUrl} alt={`Logo option ${logo.id}`} />
                      {logo.selected && (
                        <div className="selected-badge">Selected</div>
                      )}
                      {logo.concept && (
                        <div className="logo-concept-info">
                          <h4>Design Concept</h4>
                          <p>{logo.concept.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedLogo && (
                  <div className="selection-actions">
                    <button
                      className="secondary-button"
                      onClick={() => setStep(3)}
                    >
                      Back to Styles
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => setStep(5)}
                    >
                      Customize Selected Logo
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 5:
        const selectedLogoData = logoOptions.find(
          (logo) => logo.id === selectedLogo
        );
        if (!selectedLogoData) {
          return (
            <div className="step-container">
              <h1>Logo Not Found</h1>
              <p>The selected logo could not be loaded</p>
              <button className="primary-button" onClick={() => setStep(4)}>
                Back to Logo Selection
              </button>
            </div>
          );
        }

        return (
          <div className="step-container">
            <h1>Customize Your Logo</h1>
            <p>Make it perfect for your brand</p>

            <div className="customize-container">
              <div className="logo-preview">
                <div
                  className="preview-wrapper"
                  style={{ backgroundColor: `${customization.color}20` }}
                >
                  <img
                    src={selectedLogoData.imageUrl}
                    alt={`Customized ${businessName} logo`}
                    style={{
                      filter: `hue-rotate(${getHueRotation(
                        customization.color
                      )}deg)`,
                      maxWidth:
                        customization.layout === 'stacked' ? '70%' : '100%',
                    }}
                  />
                  {customization.layout !== 'icon-only' && (
                    <div
                      className="logo-text"
                      style={{
                        fontFamily: customization.typography,
                        color: customization.color,
                      }}
                    >
                      {businessName}
                    </div>
                  )}
                </div>

                <div className="preview-actions">
                  <button
                    className="download-button"
                    onClick={() => handleDownload('png')}
                  >
                    Download PNG
                  </button>
                  <button
                    className="download-button"
                    onClick={() => handleDownload('svg')}
                  >
                    Download SVG
                  </button>
                </div>
              </div>

              <div className="customization-options">
                <div className="option-group">
                  <h3>Color Scheme</h3>
                  <div className="color-palette">
                    {[
                      '#4f46e5',
                      '#10b981',
                      '#EF4444',
                      '#F59E0B',
                      '#7C3AED',
                    ].map((color) => (
                      <div
                        key={color}
                        className={`color-option ${
                          customization.color === color ? 'selected' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setCustomization({ ...customization, color })
                        }
                      />
                    ))}
                    <input
                      type="color"
                      value={customization.color}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          color: e.target.value,
                        })
                      }
                      className="color-picker"
                    />
                  </div>
                </div>

                <div className="option-group">
                  <h3>Layout</h3>
                  <div className="layout-options">
                    {['stacked', 'horizontal', 'icon-only', 'text-only'].map(
                      (layout) => (
                        <button
                          key={layout}
                          className={`layout-option ${
                            customization.layout === layout ? 'active' : ''
                          }`}
                          onClick={() =>
                            setCustomization({
                              ...customization,
                              layout: layout as LayoutOption,
                            })
                          }
                        >
                          {layout
                            .split('-')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="option-group">
                  <h3>Typography</h3>
                  <select
                    value={customization.typography}
                    onChange={(e) =>
                      setCustomization({
                        ...customization,
                        typography: e.target.value,
                      })
                    }
                    className="typography-select"
                  >
                    <option value="sans-serif">Sans Serif (Modern)</option>
                    <option value="serif">Serif (Classic)</option>
                    <option value="monospace">Monospace (Tech)</option>
                    <option value="cursive">Cursive (Elegant)</option>
                  </select>
                </div>

                <button
                  className="save-button"
                  onClick={() => {
                    alert('Customization saved!');
                    setStep(4);
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZestAI Logo Builder</h1>
        {step > 1 && step < 5 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </header>

      <main className="app-main">{renderStep()}</main>

      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Zest Fission AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
